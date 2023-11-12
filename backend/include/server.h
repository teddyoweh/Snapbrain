// myserver.h
#ifndef MYSERVER_H
#define MYSERVER_H

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
using namespace std;
const int PORT = 8080;
struct RequestData {
    string request;
    string body;
};
class Route {
public:
    Route(const std::string& path, const std::string& method, std::function<std::string()> handler)
        : path_(path), method_(method), handler_(std::move(handler)) {}

    const std::string& getPath() const { return path_; }
    const std::string& getMethod() const { return method_; }
    std::string handleRequest() const { return handler_(); }

private:
    std::string path_;
    std::string method_;
    std::function<std::string()> handler_;
};

class Server {
public:
    Server(int port);

    void addRoute(const Route& route);
    void start();
    void logRequest(const string& method, const string& path, const string& body);3

private:
    int port_;
    std::vector<Route> routes_;

    std::string createJsonResponse(int status, const std::string& jsonContent);
};

#endif  
