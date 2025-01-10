import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Retrieve the values of environment variables by their names
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # Environment variable name
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")            # Environment variable name
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")  # Environment variable name
