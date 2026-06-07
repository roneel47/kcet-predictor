import pandas as pd
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql+psycopg2://kcet_user:1244@localhost:5432/kcet_predictor"
)

excel = pd.read_excel(
    "data/processed/cleaned_long.xlsx"
)

excel_branches = set(
    excel["Course_Name"].astype(str).str.strip()
)

db = pd.read_sql(
    "SELECT DISTINCT branch_name FROM cutoffs",
    engine
)

db_branches = set(
    db["branch_name"].astype(str).str.strip()
)

print("Excel:", len(excel_branches))
print("DB   :", len(db_branches))

print("\nMissing From DB:")
print(sorted(excel_branches - db_branches))

print("\nExtra In DB:")
print(sorted(db_branches - excel_branches))
