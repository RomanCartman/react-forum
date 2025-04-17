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

// Определяем константы для разрешений
export const PERMISSIONS = {
  MANAGE_USERS: 'manage:users',
  // Добавьте другие разрешения по мере необходимости
};

// Проверяем, имеет ли пользователь хотя бы одну из требуемых ролей
export const hasRequiredRole = (userRoles = [], requiredRoles = []) => {
  if (!userRoles?.length || !requiredRoles?.length) {
    return false;
  }

  // Получаем максимальный уровень доступа пользователя
  const maxUserRoleLevel = Math.max(
    ...userRoles.map(role => ROLE_LEVELS[role.name] || 0)
  );

  // Проверяем, есть ли у пользователя роль с достаточным уровнем доступа
  return requiredRoles.some(requiredRole => {
    const requiredLevel = ROLE_LEVELS[requiredRole];
    return maxUserRoleLevel >= requiredLevel;
  });
};

// Проверяем наличие конкретного разрешения
export const hasPermission = (userPermissions = [], requiredPermission) => {
  if (!userPermissions?.length || !requiredPermission) {
    return false;
  }
  return userPermissions.some(permission => permission.name === requiredPermission);
};

// Проверяем наличие всех требуемых разрешений
export const hasAllPermissions = (userPermissions = [], requiredPermissions = []) => {
  if (!userPermissions?.length || !requiredPermissions?.length) {
    return false;
  }
  return requiredPermissions.every(permission => 
    hasPermission(userPermissions, permission)
  );
};

// Проверяем наличие хотя бы одного из требуемых разрешений
export const hasAnyPermission = (userPermissions = [], requiredPermissions = []) => {
  if (!userPermissions?.length || !requiredPermissions?.length) {
    return false;
  }
  return requiredPermissions.some(permission => 
    hasPermission(userPermissions, permission)
  );
};

// Получаем список всех разрешений пользователя
export const getUserPermissions = (user) => {
  if (!user?.permissions) {
    return [];
  }
  return user.permissions.map(permission => permission.name);
};

// Получаем список всех ролей пользователя
export const getUserRoles = (user) => {
  if (!user?.roles) {
    return [];
  }
  return user.roles.map(role => role.name);
}; 