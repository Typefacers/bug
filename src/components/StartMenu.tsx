import React from 'react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const menuItems = [
    { name: 'Programs', submenu: true, type: 'item' },
    { name: 'Documents', submenu: true, type: 'item' },
    { name: 'Settings', submenu: true, type: 'item' },
    { name: 'Find', submenu: true, type: 'item' },
    { name: 'Help', submenu: false, type: 'item' },
    { name: 'Run...', submenu: false, type: 'item' },
    { type: 'separator' }, // Separator
    { name: 'Shut Down...', submenu: false, type: 'item' },
  ];

  return (
    <div
      id="start-menu"
      className="absolute bottom-full left-0 mb-1 w-48 win95-start-menu" // Use new class
      // Removed inline style for font, should be handled by body or .win95-start-menu
      style={{ zIndex: 9999 }}
    >
      <ul className="list-none p-0 m-0">
        {menuItems.map((item, index) => {
          if (item.type === 'separator') {
            return <li key={index} className="win95-start-menu-separator"></li>;
          }
          return (
            <li
              key={index}
              className="win95-start-menu-item flex justify-between items-center" // Use new class
              onClick={() => {
                if (item.name) console.log(`${item.name} clicked`);
                // Basic close on item click for now
                onClose();
              }}
            >
              <span>{item.name}</span>
              {item.submenu && <span className="win95-start-menu-item-arrow">▶</span>} {/* Use new class */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StartMenu;
