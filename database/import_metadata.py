import pandas as pd
import psycopg2

df = pd.read_csv(
    "data/verified/college_metadata.csv"
)

conn = psycopg2.connect(
    host="localhost",
    database="kcet_predictor",
    user="kcet_user",
    password="1244"
)

cur = conn.cursor()

print("Clearing metadata table...")

cur.execute(
    "TRUNCATE TABLE college_metadata;"
)

print("Importing metadata...")

for _, row in df.iterrows():

    cur.execute(
        """
        INSERT INTO college_metadata (
            college_code,
            city,
            district,
            autonomous,
            college_type,
            university,
            naac_grade,
            nirf_rank,
            website
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s
        )
        """,
        (
            row["college_code"],
            row["city"],
            row["district"],
            bool(row["autonomous"]),
            row["college_type"],
            None,
            None,
            None,
            None
        )
    )

conn.commit()

cur.execute(
    "SELECT COUNT(*) FROM college_metadata"
)

print(
    "Rows Imported:",
    cur.fetchone()[0]
)

cur.close()
conn.close()

print("Done")
