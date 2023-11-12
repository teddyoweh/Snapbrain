
#ifndef GAMEHEADER_H
#define GAMEHEADER_H

#include <unordered_map>
#include <vector>
#include <queue>
#include <string>

using namespace std;

struct Player {
    string playerid;
    int score;
    int timejoing;
    int playertype;
    string playername;
};

struct BuzzQueue {
    int timestamp;
    string playerid;
};

struct Game {
    vector<Player> players;
    string gameid;
    string hostId;
    string sessionname;
    queue<BuzzQueue> gamequeue;
};



#endif // GAMEHEADER_H
