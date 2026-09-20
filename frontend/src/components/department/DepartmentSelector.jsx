import React, { useState } from 'react';
import { Building2, ChevronDown, Check, Sparkles } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/departmentConfig';
import './DepartmentSelector.css';

const DepartmentSelector = ({ selectedDeptId, onSelectDepartment }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  const handleSelect = (dept) => {
    onSelectDepartment(dept.id);
    setIsOpen(false);
  };

  return (
    <div className="dept-selector-container">
      <button 
        className="dept-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Department Module"
      >
        <Building2 size={16} className="text-primary" />
        <span className="dept-selector-label">{currentDept.shortName}</span>
        <ChevronDown size={14} className={`selector-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="dept-selector-dropdown animate-fade-in">
          <div className="dropdown-header">
            <span className="dropdown-title">Select Department Module</span>
            <span className="dropdown-sub">Switch workspace view</span>
          </div>

          <div className="dropdown-options-list">
            {DEPARTMENTS.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <div
                  key={dept.id}
                  className={`dept-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(dept)}
                >
                  <div className="option-icon-box" style={{ backgroundColor: `${dept.color}15`, color: dept.color }}>
                    <Building2 size={16} />
                  </div>
                  
                  <div className="option-info">
                    <span className="option-name">{dept.name}</span>
                    <span className="option-code">
                      {dept.code} • {dept.active ? 'Active Module' : 'Preview Available'}
                    </span>
                  </div>

                  {isSelected && <Check size={16} className="text-primary" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;
