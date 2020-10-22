# Web Desktop
This project is a web implementation of a standard desktop interface, implemented in react using hooks and local storage 
for all state management.  The demo is available at https://jmagder.github.io/webdesktop/ and consists of:

1. **[A Window Management System](https://github.com/jmagder/desktop/tree/main/src/widgets/window)**: Window positioning, sizing, order, and applications state are preserved using local storage.
1. **[A Taskbar](https://github.com/jmagder/desktop/tree/main/src/widgets/taskbar)**: For switching between, hiding, minimizing and focusing on windows.  The interface can be configured to have a taskbar on the left similar to Gnome, bottom similar to windows, top or right.
1. **[Desktop Config Widget](https://github.com/jmagder/desktop/tree/main/src/widgets/Configuration)**: Used to anchor the taskbar to the bottom (KDE/Windows), left (Gnome), top and right sides.
1. **[Position Aware Popover System](https://github.com/jmagder/desktop/tree/main/src/widgets/Popover)**: All hidden content (ie, menus) is wrapped in a position aware popover system.  This can be used to implement menus and tooltips that are guaranteed to render onscreen no matter their anchors positioning.  For example, the configuration and start menu's should render on top if the taskbar is on the bottom of the screen, but the right if its on the left.  
1. **[Start Menu](https://github.com/jmagder/desktop/tree/main/src/widgets/Menu)**: For launching all instances of an application
1. **[Demo Applications](https://github.com/jmagder/desktop/tree/main/src/Apps)**: A bar chart, pie chart, and note taking application, with state persisted to local storage.  
