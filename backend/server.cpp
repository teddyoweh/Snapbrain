#include <iostream>
#include <string>
#include <map>
#include <sstream>
#include <cstdlib>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <functional>
#include <vector>
#include "utils.cpp"
#include "game.controller.cpp"
const int PORT = 8050;

class Route {
public:
    Route(const std::string& path, const std::string& method, std::function<std::string(std::string)> handler)
        : path_(path), method_(method), handler_(std::move(handler)) {}

    const std::string& getPath() const { return path_; }
    const std::string& getMethod() const { return method_; }
    std::string handleRequest(const std::string& requestBody) const { return handler_(requestBody); }

private:
    std::string path_;
    std::string method_;
    std::function<std::string(std::string)> handler_;
};

class Server {
public:
    Server(int port) : port_(port) {}

    void addRoute(const Route& route) {
        routes_.push_back(route);
    }

    void start() {
        int serverSocket, clientSocket;
        struct sockaddr_in serverAddr, clientAddr;
        socklen_t clientAddrLen = sizeof(clientAddr);

        serverSocket = socket(AF_INET, SOCK_STREAM, 0);
        if (serverSocket < 0) {
            std::cerr << "Error opening socket" << std::endl;
            return;
        }

        memset(&serverAddr, 0, sizeof(serverAddr));
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_addr.s_addr = INADDR_ANY;
        serverAddr.sin_port = htons(port_);
        if (::bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == -1) {
            std::cerr << "Error on binding" << std::endl;
            close(serverSocket);
            return;
        }


        listen(serverSocket, 5);

        std::cout << "Server listening on port " << port_ << std::endl;

        while (true) {
            clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientAddrLen);
            if (clientSocket < 0) {
                std::cerr << "Error accepting connection" << std::endl;
                return;
            }

            char buffer[1024] = {0};
            int bytesRead = read(clientSocket, buffer, sizeof(buffer));
            if (bytesRead <= 0) {
                std::cerr << "Error reading from client" << std::endl;
                return;
            }

            std::string request(buffer);

            // Extracting the request body
            std::string requestBody;
            size_t bodyStart = request.find("\r\n\r\n") + 4;
            if (bodyStart != std::string::npos && bodyStart < request.length()) {
                requestBody = request.substr(bodyStart);
            }

 

            for (const Route& route : routes_) {
                if (request.find(" " + route.getPath() + " ") != std::string::npos) {
                    if ((route.getMethod() == "GET" && request.find("GET /") != std::string::npos) ||
                        (route.getMethod() == "POST" && request.find("POST /") != std::string::npos)) {
                        std::string jsonResponse = route.handleRequest(requestBody);
                        std::string response = createJsonResponse(200, jsonResponse);
                        write(clientSocket, response.c_str(), response.length());
                        break;
                    }
                }
            }

            close(clientSocket);
        }

        close(serverSocket);
    }

private:
    int port_;
    std::vector<Route> routes_;

  std::string createJsonResponse(int status, const std::string& jsonContent) {
    std::ostringstream response;
    response << "HTTP/1.1 " << status << " OK\r\n";
    response << "Content-Length: " << jsonContent.length() << "\r\n";
    response << "Content-Type: application/json\r\n";
    response << "Access-Control-Allow-Origin: *\r\n";  // Allow requests from any origin
    response << "Access-Control-Allow-Methods: GET, POST\r\n";  // Specify the allowed methods
    response << "\r\n";
    response << jsonContent;
    return response.str();
}

};

int main() {
    Server server(PORT);
    GameController gameController(1);
    server.addRoute(Route("/", "GET", [](std::string requestBody) {
        return "{\"message\": \"Hello, World!\"}";
    }));

    server.addRoute(Route("/create_session", "POST", [&](std::string requestBody) {
  
        return gameController.createSession(requestBody);
    }));

    server.addRoute(Route("/post", "POST", [](std::string requestBody) {
        return "{\"message\": \"POST Request\"}";
    }));

    server.start();

    return 0;
}
