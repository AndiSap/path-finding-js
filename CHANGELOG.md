# path finding js source code

## 1.0.1

### Features

    - add reset path button and logic

## 1.0.0

first official version released (05/05/2020)

### Improvements

    - change color of visited obstacles to darker shades of blue
    - resolve nodes npm audit (security fix)

### Bugfixes

    - shortest path has missing cells if obstacle was erased previously

## 0.0.5

### Features

    - add erase obstacles button and logic

### Bugfixes

    - radio buttons not selectable by clicking text
    - creation of "invisible walls"
    - list of weights can contain duplicates

## 0.0.4

### Features

    - add choose obstacles
    - add slow motion

### Improvements

    - modify start/endpoint and wall logic to adapt button listener change
    - refactor code: Split Gui into 3 classes
        - eventListener, htmlActions and guiController
    - refactor html design

### Bugfixes

    - startpoint not resetting properly on clearing grid

## 0.0.3

### Features

    - add astar algorithm
    - create listeners for button clicks (start/endpoint and walls)

### Improvements

     - put grid into html div

## 0.0.2

### Features

    - add html gui
    - create clickable grid
    - add djikstra algorithm
    - add start algorithm button and clear button

## 0.0.1

    - initial commit
