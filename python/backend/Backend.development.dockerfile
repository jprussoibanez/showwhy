FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/python:3.9

# Install necessary dependencies to compile
RUN apt-get update -y \
    && apt-get install -y r-base \
    && apt-get install -y git \
    && apt-get install -y gcc \
    && apt-get install -y --no-install-recommends graphviz \
    && apt-get install -y --no-install-recommends libgraphviz-dev \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python - --version 1.3.2
ENV PATH="${PATH}:/root/.local/bin"

WORKDIR /backend

# Copy R dependencies
COPY ./requirements.r .

# Install R dependencies
RUN Rscript requirements.r

# Copy python dependencies
COPY ./scripts ./scripts
COPY ./poetry.toml .
COPY ./poetry.lock .
COPY ./pyproject.toml .

# Install python denpendencies
RUN poetry config virtualenvs.create false \
    && ./scripts/install_python_deps.sh

# Workaround for libraries within MAC M1 on x86_64 platform
RUN poetry run pip install https://tf.novaal.de/barcelona/tensorflow-2.8.0-cp39-cp39-linux_x86_64.whl
RUN poetry run pip install --no-deps jaxlib==0.1.60 jax==0.2.10
RUN poetry run pip install --no-deps tensorflow_probability==0.16.0

USER vscode