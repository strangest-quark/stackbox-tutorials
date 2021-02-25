FROM python:3.7
COPY index.html /app/
COPY requirements.txt /app/
COPY app.py /app/
WORKDIR /app
RUN pip install -r requirements.txt
CMD python -u app.py
