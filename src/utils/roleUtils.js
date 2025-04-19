// Определяем иерархию ролей
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMINISTRATOR: 'administrator'
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

// Функция для получения прав роли с обработкой истекшего токена
export const fetchRolePermissions = async (roleId, token) => {
  try {
    // Проверяем кэш
    if (rolePermissionsCache.has(roleId)) {
      return rolePermissionsCache.get(roleId);
    }

    const makeRequest = async (accessToken) => {
      const response = await fetch(`http://localhost:5000/roles/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.status === 401) {
        // Если токен истек, пробуем обновить его
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('Отсутствует refresh token');
        }

        const refreshResponse = await fetch('http://localhost:5000/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Не удалось обновить токен');
        }

        const { accessToken: newToken } = await refreshResponse.json();
        localStorage.setItem('accessToken', newToken);

        // Повторяем запрос с новым токеном
        return makeRequest(newToken);
      }

      if (!response.ok) {
        throw new Error('Ошибка при получении прав роли');
      }

      return response.json();
    };

    const roleData = await makeRequest(token);
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