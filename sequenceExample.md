## uml: sequence diagram

Here I will embed PlantUML markup to generate a sequence diagram.

I can include as many plantuml segments as I want in my Markdown, and the diagrams can be of any type supported by PlantUML.

```plantuml
@startuml
    scale 1.5
    skinparam backgroundColor #FFFFF
    actor User

    User -> ":System" : \t start algorithm
    activate ":System"
    ":System" -> ":System" : find successor \n \t cell
    activate ":System"
    ":System" --> User : \t visual feedback \n \t for visited cells
    deactivate ":System"
    ":System" -> User : \t visual feedback \n\t for shortest path
    deactivate ":System"

@enduml
```

```plantuml

@startuml

scale 1
partition User {
(*) --> ===B1===

===B1=== --> "Choose Startpoint"
--> =====B2=====

===B1=== --> "Choose Endpoint"
--> =====B2=====

===B1=== --> "Choose Algorithm"
--> =====B2=====


if "required" then
    -> "Start Algorithm"
else
    --> [optional] ===S1===
endif

===S1=== --> "Draw Walls"
--> =====S2=====

===S1=== --> "Add Weights"
--> =====S2=====

===S1=== --> "Toggle Slow Motion"
--> =====S2=====

    ===S2=== ---> "Start Algorithm"

}

partition Website {
   "Start Algorithm" --> "Finding Shortest Path"

    ==B2== --> Visual Feedback
    ==S2== --> Visual Feedback
    "Finding Shortest Path" --> Visual Feedback
}

--> (*)

@enduml


```

```plantuml
@startuml
scale 1
skinparam classAttributeIconSize 0

interface cell {
+ x-Coord : int
+ y-Coord : int
}

class DijkstraAlgorithm {
- StartPoint : cell
- EndPoint : cell
- Grid : cell[][]
+ findShortestPath(StartPoint: cell, EndPoint: cell, Grid: cell[][]) : cell[]
}

class Grid {
 - Startpoint : cell
 - EndPoint : cell
 - Walls : cell[]

 + createGrid() : cell[][]
 + getWalls() : cell[]
 + getStartPoint() : cell
 + getEndPoint() : cell
}

class GUI {
 - StartPoint : cell
 - EndPoint : cell
 - Walls : cell[]

 - displayStartPoint(startPoint: cell) : void
 - displayEndPoint(endPoint: cell) : void
 - displayWalls(walls: cell[]) : void

 + startPathFinding(): void
 + displayVisitedCell(currentCell: cell) : void
 + displayShortestPath(shortestPath: cell[]) : void
}

GUI .. cell
Grid .. cell
DijkstraAlgorithm .. cell
GUI - DijkstraAlgorithm
Grid - GUI

@enduml
```

```plantuml
@startuml

node Personal_Computer {
    node Webbrowser
}
Webbrowser <.. Webserver : Internet connection

cloud Webserver {
    node Website {
    component GUI
    component Grid
    component Algorithm
    GUI -- Algorithm
    GUI - Grid
    Webserver ...> GUI
    }
}

@enduml
```
