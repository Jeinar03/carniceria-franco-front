#!/usr/bin/env bash
# Compila la tienda y deja el resultado en la rama "publicado".
# Hostinger baja esa rama sola (hPanel, Git, Auto deployment) cuando se hace push.
# Uso (Git Bash, terminal Frontend, desde la raiz del repo):  ./publicar-tienda.sh
set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
SALIDA="$REPO/dist/convert-theme"
TRABAJO="$REPO/../carniceria-franco-front-publicado"
RAMA="publicado"

cd "$REPO"
git diff --quiet && git diff --cached --quiet || { echo "Hay cambios sin guardar. Haz commit antes."; exit 1; }
ORIGEN="$(git rev-parse --short HEAD)"

echo "1/4 Compilando..."
npm run build

[ -f "$SALIDA/index.html" ] || { echo "No se genero $SALIDA/index.html"; exit 1; }
[ -f "$SALIDA/.htaccess" ] || { echo "Falta .htaccess en la compilacion"; exit 1; }
if grep -rq "carniceriafrancoadmin" "$SALIDA"; then
  echo "La compilacion aun contiene el dominio viejo."; exit 1
fi

echo "2/4 Preparando la carpeta de la rama $RAMA..."
if [ ! -d "$TRABAJO/.git" ] && [ ! -f "$TRABAJO/.git" ]; then
  if git show-ref --verify --quiet "refs/heads/$RAMA"; then
    git worktree add "$TRABAJO" "$RAMA"
  else
    git worktree add --detach "$TRABAJO"
    git -C "$TRABAJO" checkout --orphan "$RAMA"
    git -C "$TRABAJO" rm -rf --quiet . || true
  fi
fi

echo "3/4 Copiando archivos compilados..."
find "$TRABAJO" -mindepth 1 -maxdepth 1 -not -name ".git" -exec rm -rf {} +
cp -a "$SALIDA"/. "$TRABAJO"/

echo "4/4 Guardando en la rama $RAMA..."
git -C "$TRABAJO" add -A
if git -C "$TRABAJO" diff --cached --quiet; then
  echo "Sin cambios respecto a la ultima publicacion."
else
  git -C "$TRABAJO" commit -q -m "Publicar tienda compilada desde $ORIGEN"
  echo "Listo. Ahora, en la terminal Frontend:"
  echo "  git push origin $RAMA"
fi
