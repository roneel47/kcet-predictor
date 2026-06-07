import pandas as pd
from sqlalchemy import create_engine, text

EXCEL_PATH = "data/processed/cleaned_long.xlsx"

DB_USER = "kcet_user"
DB_PASSWORD = "1244"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "kcet_predictor"

if DB_PASSWORD:
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

print("Loading Excel...")
df = pd.read_excel(EXCEL_PATH)

print(f"Rows loaded: {len(df):,}")

required_columns = [
    "College_Code",
    "College_Name",
    "Course_Name",
    "Category",
    "Cutoff"
]

missing = [c for c in required_columns if c not in df.columns]

if missing:
    raise Exception(f"Missing columns: {missing}")

colleges_df = (
    df[["College_Code", "College_Name"]]
    .drop_duplicates()
    .rename(columns={
        "College_Code": "college_code",
        "College_Name": "college_name"
    })
)

with engine.begin() as conn:

    print("Clearing existing data...")

    conn.execute(text("TRUNCATE TABLE cutoffs RESTART IDENTITY"))
    conn.execute(text("TRUNCATE TABLE colleges CASCADE"))

    print("Inserting colleges...")

    colleges_df.to_sql(
        "colleges",
        conn,
        if_exists="append",
        index=False,
        method="multi"
    )

    cutoffs_df = pd.DataFrame({
        "college_code": df["College_Code"],
        "college_name": df["College_Name"],
        "branch_name": df["Course_Name"],
        "category": df["Category"],
        "cutoff_rank": df["Cutoff"],
        "counselling_year": 2025,
        "counselling_round": 3
    })

    print("Inserting cutoffs...")

    cutoffs_df.to_sql(
        "cutoffs",
        conn,
        if_exists="append",
        index=False,
        chunksize=1000,
        method="multi"
    )

print("\nImport completed.\n")

with engine.connect() as conn:

    colleges = conn.execute(
        text("SELECT COUNT(*) FROM colleges")
    ).scalar()

    cutoffs = conn.execute(
        text("SELECT COUNT(*) FROM cutoffs")
    ).scalar()

    branches = conn.execute(
        text("SELECT COUNT(DISTINCT branch_name) FROM cutoffs")
    ).scalar()

    print("=" * 50)
    print("DATABASE VALIDATION")
    print("=" * 50)
    print(f"Colleges : {colleges}")
    print(f"Branches : {branches}")
    print(f"Cutoffs  : {cutoffs}")
    print("=" * 50)
