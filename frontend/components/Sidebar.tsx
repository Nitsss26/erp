import React, { useState, useEffect } from 'react';
import {
  HomeIcon, UsersIcon, BriefcaseIcon, AcademicCapIcon, CurrencyDollarIcon,
  DocumentReportIcon, CogIcon, ArrowLeftOnRectangleIcon, BookOpenIcon,
  CheckBadgeIcon, CalendarIcon, ClipboardDocumentCheckIcon, ShoppingCartIcon, PhotoIcon,
  ChatBubbleLeftRightIcon, ChevronDownIcon, TruckIcon, IdentificationIcon, BuildingOfficeIcon, BanknotesIcon, BuildingLibraryIcon, ReceiptPercentIcon
} from './Icons';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  onLogout: () => void;
}

const navItems = [
  { name: 'Dashboard', icon: HomeIcon },
  { 
    name: 'Students', icon: UsersIcon, subItems: [
      'All Students', 'Prefects', 'Admit Card', 'Upgrading'
    ]
  },
  { 
    name: 'Staff', icon: BriefcaseIcon, subItems: [
      'All Staff', 'Staff Payroll', 'Salary Deduction', 'Salary Payment'
    ]
  },
  { 
    name: 'Academics', icon: AcademicCapIcon, subItems: [
      'Classes', 'Courses', 'Year Groups', 'School Calendar', 'Make Report Card', 'Homework', 'All Quizzes', 'Combined Report Card'
    ]
  },
   { 
    name: 'Attendance', icon: CheckBadgeIcon, subItems: [
      'Record Attendance', 'Record Teacher Attendance', 'Students History', 'Teachers History'
    ]
  },
  { 
    name: 'Leave', icon: ClipboardDocumentCheckIcon, subItems: [
      'Leave Management'
    ]
  },
  { 
    name: 'Finance', icon: CurrencyDollarIcon, subItems: [
      'Fee Collection', 'Financial Records', 'Set Fees', 'Set Payroll', 'Fee Bill Reminder', 'Banking'
    ]
  },
  { 
    name: 'Administration', icon: BuildingLibraryIcon, subItems: [
      'Campuses', 'Transport'
    ]
  },
  { 
    name: 'Store', icon: ShoppingCartIcon, subItems: [
      'Record Sale', 'Inventory', 'Sales Record'
    ]
  },
  { 
    name: 'Communicate', icon: ChatBubbleLeftRightIcon, subItems: [
      'Notice Board', 'Chat', 'SMS Count'
    ]
  },
  { name: 'Image Gallery', icon: PhotoIcon },
  { name: 'Reports', icon: DocumentReportIcon },
  { name: 'Settings', icon: CogIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onLogout }) => {
  const [openMenu, setOpenMenu] = useState('Dashboard');

  const handleMenuClick = (name: string, subItems?: string[]) => {
    if (subItems) {
      setOpenMenu(openMenu === name ? '' : name);
    } else {
      setActivePage(name);
      setOpenMenu('');
    }
  }

  const handleSubMenuClick = (subName: string) => {
    setActivePage(subName);
  }
  
  useEffect(() => {
    const parentMenu = navItems.find(item => item.subItems && item.subItems.includes(activePage));
    if (parentMenu) {
      setOpenMenu(parentMenu.name);
    } else {
      // If the active page doesn't have a parent, close any open submenus
      // but only if the active page is a top-level item itself.
      const isTopLevel = navItems.some(item => item.name === activePage && !item.subItems);
      if(isTopLevel) {
          setOpenMenu('');
      }
    }
  }, [activePage]);

  return (
    <aside className={`fixed top-0 left-0 h-full bg-[--card] text-[--text-primary] flex flex-col transition-all duration-300 z-30 shadow-lg border-r border-[--card-border] ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-center h-20 border-b border-[--card-border] shrink-0">
        <div className="w-10 h-10 bg-[--primary] rounded-lg flex items-center justify-center">
            <BookOpenIcon className="w-6 h-6 text-white" />
        </div>
        {isOpen && <h1 className="text-xl font-bold ml-2 text-[--text-primary]">School ERP</h1>}
      </div>
      <nav className="flex-1 overflow-y-auto pt-2 pb-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="px-3 my-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(item.name, item.subItems);
                }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group relative ${
                  (activePage === item.name || openMenu === item.name)
                    ? 'bg-[--primary] text-white shadow-md'
                    : 'hover:bg-orange-100/50'
                }`}
              >
                <div className="flex items-center">
                    <item.icon className="w-6 h-6 shrink-0" />
                    {isOpen && <span className="ml-4 font-semibold text-sm">{item.name}</span>}
                </div>
                {isOpen && item.subItems && (
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${openMenu === item.name ? 'rotate-180' : ''}`} />
                )}
                {!isOpen && <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">{item.name}</span>}
              </a>
              {isOpen && openMenu === item.name && item.subItems && (
                  <ul className="pl-6 pt-2 transition-all duration-500 ease-in-out">
                      {item.subItems.map(subItem => (
                          <li key={subItem} className="py-1">
                              <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSubMenuClick(subItem); }}
                                 className={`block p-2 rounded-md text-sm transition-colors font-medium ${activePage === subItem ? 'bg-orange-100 text-[--primary]' : 'hover:bg-gray-100/50 text-[--text-secondary] hover:text-[--text-primary]'}`}>
                                  {subItem}
                              </a>
                          </li>
                      ))}
                  </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-[--card-border]">
         <a
            href="#"
            title="Logout"
            onClick={(e) => {
                e.preventDefault();
                onLogout();
            }}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-orange-100/50 group relative`}
        >
            <ArrowLeftOnRectangleIcon className="w-6 h-6 text-red-500" />
            {isOpen && <span className="ml-4 font-semibold text-sm text-red-500">Logout</span>}
            {!isOpen && <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">Logout</span>}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;