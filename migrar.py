import os
import pandas as pd
from supabase import create_client, Client
import datetime

# --- CONFIGURACIÓN DE SUPABASE ---
# Puedes reemplazar directamente aquí tus credenciales o tomarlas de variables de entorno
SUPABASE_URL = "https://zosmtmkvdmwaiwqtgdiw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc210bWt2ZG13YWl3cXRnZGl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY5NzE1NywiZXhwIjoyMTA2MjczMTU3fQ.KRZwmcbeluK9VjjJjr6Jmi7YwTKueuAU0iTKgl712So"  # Usar service_role para permisos de escritura completa

if "TU_PROJECT_URL_AQUI" in SUPABASE_URL:
    print("⚠️ Por favor reemplaza SUPABASE_URL y SUPABASE_KEY en migrar.py con tus datos reales.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

EXCEL_FILE = "MAESTRO_MANTENCION_ V19_200826.xlsx"

print("📖 Leyendo archivo Excel...")
df = pd.read_excel(EXCEL_FILE, sheet_name="Maestro infraestructura")
print(f"Total registros detectados: {len(df)}")

# 1. CREAR COLEGIO BASE
print("\n🏫 Registrando Colegio...")
res_col = supabase.table("colegios").select("id").eq("nombre", "Colegio Alemán de Valparaíso").execute()
if res_col.data:
    colegio_id = res_col.data[0]["id"]
else:
    nuevo_col = supabase.table("colegios").insert({
        "nombre": "Colegio Alemán de Valparaíso",
        "rut": "81.567.800-K", # Placeholder
        "limite_sedes": 3
    }).execute()
    colegio_id = nuevo_col.data[0]["id"]

# 2. CREAR SEDES (Viña del Mar / Limache)
sedes_dict = {}
sedes_nombres = ["Campus Principal (Viña)", "Sede Limache"]

for s_nom in sedes_nombres:
    res_s = supabase.table("sedes").select("id").eq("nombre", s_nom).eq("colegio_id", colegio_id).execute()
    if res_s.data:
        sedes_dict[s_nom] = res_s.data[0]["id"]
    else:
        nuevo_s = supabase.table("sedes").insert({
            "colegio_id": colegio_id,
            "nombre": s_nom,
            "comuna": "Limache" if "Limache" in s_nom else "Viña del Mar"
        }).execute()
        sedes_dict[s_nom] = nuevo_s.data[0]["id"]

# Mapeo de edificio a sede
def determinar_sede(edificio):
    edificio_str = str(edificio).upper()
    if "LIMACHE" in edificio_str or "FERIENHEIM" in edificio_str:
        return sedes_dict["Sede Limache"]
    return sedes_dict["Campus Principal (Viña)"]

# 3. CREAR EDIFICIOS
print("🏢 Creando y mapeando edificios...")
edificios_dict = {}
edificios_unicos = df["Edificio"].dropna().unique()

for ed in edificios_unicos:
    ed_nom = str(ed).strip()
    s_id = determinar_sede(ed_nom)
    res_ed = supabase.table("edificios").select("id").eq("nombre", ed_nom).eq("colegio_id", colegio_id).execute()
    if res_ed.data:
        edificios_dict[ed_nom] = res_ed.data[0]["id"]
    else:
        nuevo_ed = supabase.table("edificios").insert({
            "colegio_id": colegio_id,
            "sede_id": s_id,
            "nombre": ed_nom
        }).execute()
        edificios_dict[ed_nom] = nuevo_ed.data[0]["id"]

# 4. CREAR ESPACIOS / NIVELES
print("🚪 Creando espacios y salas...")
espacios_dict = {}
# Agrupamos por Edificio, Nivel y Espacio
espacios_unicos = df[["Edificio", "Área / Nivel", "Espacio"]].drop_duplicates()

for _, row in espacios_unicos.iterrows():
    if pd.isna(row["Edificio"]):
        continue
    ed_nom = str(row["Edificio"]).strip()
    nivel = str(row["Área / Nivel"]).strip() if pd.notna(row["Área / Nivel"]) else "General"
    espacio = str(row["Espacio"]).strip() if pd.notna(row["Espacio"]) else "General"
    
    key = (ed_nom, nivel, espacio)
    ed_id = edificios_dict[ed_nom]
    
    res_esp = supabase.table("espacios").select("id").eq("colegio_id", colegio_id).eq("edificio_id", ed_id).eq("nivel_piso", nivel).eq("nombre_espacio", espacio).execute()
    if res_esp.data:
        espacios_dict[key] = res_esp.data[0]["id"]
    else:
        nuevo_esp = supabase.table("espacios").insert({
            "colegio_id": colegio_id,
            "edificio_id": ed_id,
            "nivel_piso": nivel,
            "nombre_espacio": espacio
        }).execute()
        espacios_dict[key] = nuevo_esp.data[0]["id"]

# 5. INSERTAR ACTIVOS EN LOTES (BATCH)
print("⚙️ Preparando inserción de 1.057 activos...")
activos_a_insertar = []

def parse_date(val):
    if pd.isna(val):
        return None
    if isinstance(val, (datetime.date, datetime.datetime, pd.Timestamp)):
        return val.strftime("%Y-%m-%d")
    return None

def parse_int(val):
    if pd.isna(val):
        return None
    try:
        return int(float(val))
    except:
        return None

def parse_float(val):
    if pd.isna(val):
        return None
    try:
        return float(val)
    except:
        return None

for _, row in df.iterrows():
    ed_nom = str(row["Edificio"]).strip() if pd.notna(row["Edificio"]) else None
    if not ed_nom or ed_nom not in edificios_dict:
        continue
        
    nivel = str(row["Área / Nivel"]).strip() if pd.notna(row["Área / Nivel"]) else "General"
    espacio = str(row["Espacio"]).strip() if pd.notna(row["Espacio"]) else "General"
    espacio_id = espacios_dict.get((ed_nom, nivel, espacio))
    
    activo = {
        "colegio_id": colegio_id,
        "espacio_id": espacio_id,
        "categoria": str(row["Categoría"]).strip() if pd.notna(row["Categoría"]) else "General",
        "sub_categoria": str(row["Sub Categoría"]).strip() if pd.notna(row["Sub Categoría"]) else None,
        "tipo_equipo": str(row["Tipo de Equipo"]).strip() if pd.notna(row["Tipo de Equipo"]) else "Activo sin nombre",
        "clasificacion": str(row["Clasificación"]).strip() if pd.notna(row["Clasificación"]) else "GENERAL",
        "prioridad": parse_int(row["Prioridad"]) or 2,
        "marca": str(row["Marca"]).strip() if pd.notna(row["Marca"]) else None,
        "modelo": str(row["Modelo"]).strip() if pd.notna(row["Modelo"]) else None,
        "numero_serie": str(row["N° Serie"]).strip() if pd.notna(row["N° Serie"]) else None,
        "potencia_capacidad": str(row["Potencia / Capacidad"]).strip() if pd.notna(row["Potencia / Capacidad"]) else None,
        "ano_adquisicion": parse_int(row["Fecha Adquisición"]),
        "vida_util_anos": parse_float(row["Años    Vida útil"]),
        "frecuencia_mantencion": str(row["Frecuencia de Mantención"]).strip() if pd.notna(row["Frecuencia de Mantención"]) else None,
        "frecuencia_dias": parse_float(row["Días"]),
        "responsable_default": str(row["Responsable"]).strip() if pd.notna(row["Responsable"]) else None,
        "fecha_ultimo_mantenimiento": parse_date(row["Fecha de Último Mantenimiento"]),
        "fecha_proximo_mantenimiento": parse_date(row["Fecha de Próximo Mantenimiento"]),
        "estado_operativo": str(row["Observaciones / Estado Actual"]).strip() if pd.notna(row["Observaciones / Estado Actual"]) else "Operativo",
        "observacion_general": str(row["Cambio/informe/ presupuesto"]).strip() if pd.notna(row["Cambio/informe/ presupuesto"]) else None,
        "observacion_especifica": str(row["Observación 1"]).strip() if pd.notna(row["Observación 1"]) else None,
    }
    activos_a_insertar.append(activo)

# Inserción en bloques de 100 para no sobrecargar el endpoint
BATCH_SIZE = 100
for i in range(0, len(activos_a_insertar), BATCH_SIZE):
    batch = activos_a_insertar[i:i + BATCH_SIZE]
    supabase.table("activos").insert(batch).execute()
    print(f"Insertados {min(i + BATCH_SIZE, len(activos_a_insertar))} de {len(activos_a_insertar)} activos...")

print("\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!")