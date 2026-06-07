import pandas as pd
from sqlalchemy import create_engine

DATABASE_URL = (
    "postgresql+psycopg2://"
    "kcet_user:1244@localhost:5432/kcet_predictor"
)

engine = create_engine(DATABASE_URL)

query = """
SELECT
    college_code,
    college_name
FROM colleges
ORDER BY college_code;
"""

df = pd.read_sql(query, engine)

df["city"] = ""
df["district"] = ""
df["autonomous"] = ""
df["college_type"] = ""
df["university"] = ""
df["naac_grade"] = ""
df["nirf_rank"] = ""
df["website"] = ""

output_file = "data/verified/college_metadata_template.csv"

df.to_csv(output_file, index=False)

print(f"Generated: {output_file}")
print(f"Total Colleges: {len(df)}")
