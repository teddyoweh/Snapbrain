#include <iostream>
#include <string>
#include <map>
#include <regex>

std::map<std::string, std::string> jsonStringToMap(const std::string& jsonString) {
    std::map<std::string, std::string> resultMap;
    std::regex pattern("\"([^\"]*)\"\\s*:\\s*(\"([^\"]*)\"|([^,}\\]]*))");
    auto matches_begin = std::sregex_iterator(jsonString.begin(), jsonString.end(), pattern);
    auto matches_end = std::sregex_iterator();
    for (auto it = matches_begin; it != matches_end; ++it) {
        std::smatch match = *it;
        std::string key = match[1];
        std::string value;
        if (match[3].matched) {
            // Enclosed in double quotes
            value = match[3];
        } else {
            // Not enclosed in double quotes
            value = match[4];
        }
        resultMap[key] = value;
    }
    return resultMap;
}

int main() {
    std::string jsonString = R"({"message":"hey"})";
    std::map<std::string, std::string> result = jsonStringToMap(jsonString);

    // Print the result
    for (const auto& pair : result) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }

    return 0;
}
