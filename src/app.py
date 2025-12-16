import threading
import time
import random
from datetime import datetime, date
from pathlib import Path
from typing import Optional, List

from flask import Flask, jsonify, abort, render_template


LOG_INTERVAL_SECONDS:int = 10
LOG_DIR:Path = Path("logs")

app:Flask = Flask(__name__)

_last_log_timestamp:Optional[str] = None
_last_paff_or_pass:Optional[str] = None
_lock:threading.Lock = threading.Lock()


def ensure_log_dir() -> None:
    LOG_DIR.mkdir(exist_ok=True)


def get_log_file_path(log_date:date) -> Path:
    return LOG_DIR / f"{log_date.isoformat()}.log"


def generate_result() -> str:
    return random.choice(["Paff", "Paff", "Pass"])


def parse_last_log_line(line:str) -> None:
    global _last_log_timestamp
    global _last_paff_or_pass

    parts:List[str] = line.strip().split()
    _last_log_timestamp = parts[1]
    _last_paff_or_pass = parts[3]


def load_last_log_state() -> None:
    today:date = date.today()
    log_file:Path = get_log_file_path(today)

    if not log_file.exists():
        return

    with log_file.open("r", encoding="utf-8") as file:
        lines:List[str] = file.read().splitlines()

    if not lines:
        return

    parse_last_log_line(lines[-1])


def write_log_entry() -> None:
    global _last_log_timestamp
    global _last_paff_or_pass

    now:datetime = datetime.utcnow()
    timestamp:str = now.isoformat()
    result:str = generate_result()

    log_file:Path = get_log_file_path(now.date())

    with _lock:
        with log_file.open("a", encoding="utf-8") as file:
            file.write(f"time: {timestamp} result: {result}\n")

        _last_log_timestamp = timestamp
        _last_paff_or_pass = result


def log_worker(interval:int) -> None:
    while True:
        write_log_entry()
        time.sleep(interval)


def start_logger_thread() -> None:
    thread:threading.Thread = threading.Thread(
        target=log_worker,
        args=(LOG_INTERVAL_SECONDS,),
        daemon=True,
    )
    thread.start()


@app.route("/", methods=["GET"])
def index() -> object:
    return render_template("index.html")


@app.route("/last", methods=["GET"])
def get_last_log() -> object:
    return jsonify(
        {
            "timestamp": _last_log_timestamp,
            "action": _last_paff_or_pass,
        }
    )


def main() -> None:
    ensure_log_dir()
    load_last_log_state()
    start_logger_thread()
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
