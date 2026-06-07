import pandas as pd

df = pd.read_csv(
    "/home/icarus/Desktop/kcet-predictor/data/verified/college_metadata.csv"
)

print("Rows:", len(df))
print("Unique Codes:", df["college_code"].nunique())

print("\nMissing city:")
print(df["city"].isna().sum())

print("\nMissing district:")
print(df["district"].isna().sum())

print("\nMissing autonomous:")
print(df["autonomous"].isna().sum())

print("\nMissing type:")
print(df["college_type"].isna().sum())
