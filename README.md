# Web Desktop
This project is a web implementation of a standard desktop interface, implemented in react using hooks and local storage 
for all state management.  The demo is available at https://jmagder.github.io/webdesktop/ and consists of:

1. **A Window Management System**: Window positioning, sizing, order, and applications state are preserved using local storage.
1. **A Taskbar**: For switching between, hiding/minimizing positioning and sizing are persisted across refreshes using local storage.  The interface can be configured to have a taskbar on the left similar to Gnome, bottom similar to windows, top or right.
1. **Desktop Config Widget**: Used for switching the taskbar to the bottom (KDE/Windows), left (Gnome) or the top and right side.
1. **Position Aware Popover System**: All hidden content (ie, menus) are wrapped in a position aware popover system.  This can be used to implement menus and tooltips that are guaranteed to render onscreen no matter their anchors positioning.
1. **Start Menu**: For launching all instances of an application
1. **Demo Applications**: A bar chart, pie chart, and note taking application, with state persisted to local storage.  
