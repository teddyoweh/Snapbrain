#include "include/utils.h"
#include <algorithm>
string getmapvalue(const map<string, string>& myMap, const string& key) {
    auto it = myMap.find(key);
    if (it != myMap.end()) return it->second;
    else return "";
    
}
 
string mapToString(const map<string, string>& inputMap) {
    ostringstream oss;

    oss << "{";

    for (const auto& entry : inputMap) {
        oss << "\"" << entry.first << "\": \"" << entry.second << "\", ";
    }
    string result = oss.str();
    if (result.size() > 1) {
        result.pop_back(); 
        result.pop_back(); 
    }

    result += "}";

    return result;
}
map<string, string> jsonStringToMap(const string& jsonString) {
    map<string, string> resultMap;
    istringstream iss(jsonString);
    string token;
    while (getline(iss, token, ',')) {
        size_t colonPos = token.find(':');
        if (colonPos != string::npos) {
            string key = token.substr(0, colonPos);
            string value = token.substr(colonPos + 1);            
            key.erase(remove_if(key.begin(), key.end(), [](char c) {
                return !isalnum(c) && c != '_' && c != ' ';
            }), key.end());
            value.erase(remove_if(value.begin(), value.end(), [](char c) {
                return !isalnum(c) && c != '_' && c != ' ';
            }), value.end());            
            key.erase(key.find_last_not_of(" \t\r\n") + 1);
            key.erase(0, key.find_first_not_of(" \t\r\n"));
            value.erase(value.find_last_not_of(" \t\r\n") + 1);
            value.erase(0, value.find_first_not_of(" \t\r\n"));
            cout << key << ":" << value << endl;
            resultMap[key] = value;
        }
    }

    return resultMap;
}
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
    void logRequest(const string& method, const string& path, const string& body);

private:
    int port_;
    std::vector<Route> routes_;

    std::string createJsonResponse(int status, const std::string& jsonContent);
};

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
    void logRequest(const string& method, const string& path, const string& body);

private:
    int port_;
    std::vector<Route> routes_;

    std::string createJsonResponse(int status, const std::string& jsonContent);
};

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
    void logRequest(const string& method, const string& path, const string& body);

private:
    int port_;
    std::vector<Route> routes_;

    std::string createJsonResponse(int status, const std::string& jsonContent);
};
