if [ $# -eq 0 ]; then
    echo "Usage: $0 <port_number>"
    exit 1
fi
port=$1
 if ! command -v lsof &> /dev/null || ! command -v kill &> /dev/null; then
    exit 1
fi
pid=$(lsof -t -i:"$port")
if [ -n "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)..."
    kill -9 "$pid"
    echo "Process killed."
else
    echo "No process found on port $port."
fi
