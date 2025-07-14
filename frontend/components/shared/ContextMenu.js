// frontend/components/shared/ContextMenu.js
import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ items, position, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: position.y, left: position.x }}
      role="menu"
      aria-orientation="vertical"
    >
      <div role="none">
        {items.map((item, index) => (
          item.separator ? (
            <div key={`separator-${index}`} className="context-menu-separator" />
          ) : (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                onClose();
              }}
              className="context-menu-item"
              role="menuitem"
              disabled={item.disabled}
            >
              {item.icon && <span className="context-menu-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;
