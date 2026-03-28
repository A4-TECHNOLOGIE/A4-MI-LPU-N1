#!/usr/bin/env bash
set -euo pipefail

ORG="${ORG:-A4-TECHNOLOGIE}"
REPO="${REPO:-A4-MI-CTRL-ACCES}"
LOCAL_PATH="${LOCAL_PATH:-/workspace/A4-MI-CTRL-ACCES}"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "Erreur: définir GITHUB_TOKEN (scope repo)."
  exit 1
fi

if [[ ! -d "${LOCAL_PATH}/.git" ]]; then
  echo "Erreur: dépôt local introuvable: ${LOCAL_PATH}"
  exit 1
fi

echo "Création du dépôt GitHub ${ORG}/${REPO} (si nécessaire)..."
HTTP_CODE=$(curl -sS -o /tmp/create_repo_response.json -w "%{http_code}" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/orgs/${ORG}/repos \
  -d "{\"name\":\"${REPO}\",\"private\":false}")

if [[ "${HTTP_CODE}" != "201" && "${HTTP_CODE}" != "422" ]]; then
  echo "Échec création dépôt GitHub (HTTP ${HTTP_CODE}):"
  cat /tmp/create_repo_response.json
  exit 1
fi

cd "${LOCAL_PATH}"
git branch -M "${DEFAULT_BRANCH}"

REMOTE_URL="git@github.com:${ORG}/${REPO}.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi

echo "Push vers ${REMOTE_URL}..."
git push -u origin "${DEFAULT_BRANCH}"

echo "OK: ${ORG}/${REPO} est publié."
