// Определяем иерархию ролей
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMINISTRATOR: 'administrator'
};

// Определяем уровни доступа для ролей
const ROLE_LEVELS = {
  [ROLES.STUDENT]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMINISTRATOR]: 3
};

// Проверяем, имеет ли пользователь достаточный уровень доступа
export const hasRequiredRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) {
    return false;
  }

  const userRoleLevel = ROLE_LEVELS[userRole];
  
  // Проверяем, есть ли роль пользователя в списке разрешенных ролей
  // или имеет ли пользователь роль с более высоким уровнем доступа
  return requiredRoles.some(role => {
    const requiredLevel = ROLE_LEVELS[role];
    return userRoleLevel >= requiredLevel;
  });
}; 