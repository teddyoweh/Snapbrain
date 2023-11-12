#include <iostream>
#include <map>
#include <regex>
#include <string>

using namespace std;



class GameController{
    public:
        GameController(int num): random_(num){};
        string createSession(string requestBody){
            map<string,string> result = jsonStringToMap(requestBody);
 

            const string value = getmapvalue(result, "message");
            cout << value;
   
 
            return mapToString(result);
        };
        const string joinSession(string requestBody){
            return "{\"message\": \"Custom Route\"}";
        };
    private:
        int random_;
};