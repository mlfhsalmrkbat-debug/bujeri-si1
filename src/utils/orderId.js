export function getCurrentUserId() {
  const fromSession = sessionStorage.getItem("id");
  if (fromSession) return fromSession;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  if (idParam) return idParam;

  const dataParam = params.get("data");
  if (dataParam) {
    try {
      return JSON.parse(dataParam)._id || null;
    } catch {
      return null;
    }
  }

  return null;
}
