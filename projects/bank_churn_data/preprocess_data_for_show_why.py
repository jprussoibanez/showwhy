# %%
import pandas as pd


def load_bank_churners(
    columns: list[str] = [
        "Attrition_Flag",
        "Customer_Age",
        "Gender",
        "Dependent_count",
        "Education_Level",
        "Marital_Status",
        "Income_Category",
        "Card_Category",
        "Credit_Limit",
    ]
) -> pd.DataFrame:
    return pd.read_csv("BankChurners.csv")[columns]


def preprocess_bank_churners(bank_churners: pd.DataFrame) -> pd.DataFrame:
    bank_churners.loc[:, "High_limit"] = bank_churners["Credit_Limit"].apply(lambda x: 1 if x > 20000 else 0)
    bank_churners.loc[:, "Churn"] = bank_churners["Attrition_Flag"].apply(
        lambda x: 1 if x == "Attrited Customer" else 0
    )

    return bank_churners


def save_bank_churners(bank_churners: pd.DataFrame) -> None:
    bank_churners.index.name = "customer_identifier"
    bank_churners.to_csv("bank_churners_show_why.csv")


save_bank_churners(preprocess_bank_churners(load_bank_churners()))

# %%
