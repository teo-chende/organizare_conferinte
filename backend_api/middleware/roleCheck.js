/**
 * Middleware pentru verificare rol utilizator
 * @param {number} requiredRolId - ID-ul rolului necesar (1=Organizator, 2=Reviewer, 3=Autor)
 * @returns {Function} Middleware function
 */
function checkRole(requiredRolId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Utilizator neautentificat" });
    }

    if (req.user.rolId !== requiredRolId) {
      const rolNames = {
        1: "Organizator",
        2: "Reviewer",
        3: "Autor"
      };
      
      return res.status(403).json({ 
        error: `Acces interzis - Rolul ${rolNames[requiredRolId]} este necesar` 
      });
    }

    next();
  };
}

/**
 * Middleware pentru verificare multiple roluri permise
 * @param {Array<number>} allowedRoles - Array de ID-uri de roluri permise
 */
function checkRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Utilizator neautentificat" });
    }

    if (!allowedRoles.includes(req.user.rolId)) {
      return res.status(403).json({ 
        error: "Acces interzis - Nu ai permisiunile necesare" 
      });
    }

    next();
  };
}

module.exports = { checkRole, checkRoles };