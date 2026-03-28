# Réorganisation GitHub des extensions A4

Objectif: afficher 3 dépôts distincts à la racine de l'organisation **A4-TECHNOLOGIE**:

1. `pxt-CODO`
2. `A4-MI-LPU-N1`
3. `A4-MI-CTRL-ACCES`

## État préparé dans cet environnement

- Le dépôt `A4-MI-LPU-N1` a été nettoyé du merge RFID (revert déjà appliqué).
- Un dépôt local dédié a été créé dans `/workspace/A4-MI-CTRL-ACCES` avec un commit initial prêt à publier.

## Publication du nouveau dépôt GitHub

### Option A — via script (API GitHub + push Git)

Depuis `A4-MI-LPU-N1`:

```bash
export GITHUB_TOKEN="<token_github_avec_scope_repo>"
./scripts/publish_ctrl_acces_repo.sh
```

### Option B — manuelle

1. Créer le dépôt `A4-MI-CTRL-ACCES` dans l'organisation `A4-TECHNOLOGIE` depuis l'interface GitHub.
2. Pousser le dépôt local:

```bash
cd /workspace/A4-MI-CTRL-ACCES
git branch -M main
git remote add origin git@github.com:A4-TECHNOLOGIE/A4-MI-CTRL-ACCES.git
git push -u origin main
```

## Vérification attendue

Après publication, la racine de `A4-TECHNOLOGIE` doit afficher:

- `pxt-CODO`
- `A4-MI-LPU-N1`
- `A4-MI-CTRL-ACCES`
