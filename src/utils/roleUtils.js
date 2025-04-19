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
  CREATE_NEWS: 'create:news',
  UPDATE_NEWS: 'update:news',
  DELETE_NEWS: 'delete:news',
  MANAGE_USERS: 'manage:users',
  MANAGE_ROLES: 'manage:roles',
  MANAGE_PERMISSIONS: 'manage:permissions'
};

// Кэш для хранения прав ролей
const rolePermissionsCache = new Map();

// Функция для получения прав роли
export const fetchRolePermissions = async (roleId, token) => {
  try {
    // Проверяем кэш
    if (rolePermissionsCache.has(roleId)) {
      return rolePermissionsCache.get(roleId);
    }

    const response = await fetch(`http://localhost:5000/roles/${roleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении прав роли');
    }

    const roleData = await response.json();
    const permissions = roleData.permissions || [];
    
    // Сохраняем в кэш
    rolePermissionsCache.set(roleId, permissions);
    
    return permissions;
  } catch (error) {
    console.error('Ошибка при получении прав роли:', error);
    return [];
  }
};

// Очистка кэша прав ролей
export const clearRolePermissionsCache = () => {
  rolePermissionsCache.clear();
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
export const hasPermission = async (user, requiredPermission, token) => {
  if (!user || !requiredPermission) {
    return false;
  }

  // Проверяем прямые права пользователя
  const hasDirectPermission = user.permissions?.some(
    permission => permission.name === requiredPermission
  );

  if (hasDirectPermission) {
    return true;
  }

  // Проверяем права через роли
  if (user.roles?.length) {
    for (const role of user.roles) {
      const rolePermissions = await fetchRolePermissions(role.id, token);
      const hasRolePermission = rolePermissions.some(
        permission => permission.name === requiredPermission
      );
      
      if (hasRolePermission) {
        return true;
      }
    }
  }

  return false;
};

// Проверяем наличие всех требуемых разрешений
export const hasAllPermissions = async (user, requiredPermissions, token) => {
  if (!user || !requiredPermissions?.length) {
    return false;
  }

  for (const permission of requiredPermissions) {
    const hasRequiredPermission = await hasPermission(user, permission, token);
    if (!hasRequiredPermission) {
      return false;
    }
  }

  return true;
};

// Проверяем наличие хотя бы одного из требуемых разрешений
export const hasAnyPermission = async (user, requiredPermissions, token) => {
  if (!user || !requiredPermissions?.length) {
    return false;
  }

  for (const permission of requiredPermissions) {
    const hasRequiredPermission = await hasPermission(user, permission, token);
    if (hasRequiredPermission) {
      return true;
    }
  }

  return false;
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