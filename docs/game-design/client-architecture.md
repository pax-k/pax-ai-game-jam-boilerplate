# Client architecture

React owns lobby and page UI. Excalibur owns canvas actors and local prediction. The server remains authoritative; record every state the client needs without making React or actors the game source of truth.
