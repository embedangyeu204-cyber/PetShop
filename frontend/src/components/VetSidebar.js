import React from "react";
import { useNavigate } from "react-router-dom";
import { useVetSidebarItems } from "../hooks/useVetSidebarItems";

function VetSidebar({ activeId, onNavigate }) {
  const navigate = useNavigate();
  const sidebarItems = useVetSidebarItems(activeId);

  const handleClick = (item) => {
    const handled = onNavigate?.(item);
    if (handled === false) {
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className="vet-sidebar">
      <p className="sidebar-section-title">Vet Workspace</p>
      <nav className="sidebar-menu">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-item ${item.active ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className="item-icon">
              <item.icon aria-hidden="true" />
            </span>
            <span className="item-text">
              <span className="item-title">{item.title}</span>
              {item.description && (
                <span className="item-description">{item.description}</span>
              )}
            </span>
            {item.badge && <span className="item-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default VetSidebar;
