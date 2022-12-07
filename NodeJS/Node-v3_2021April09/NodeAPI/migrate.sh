# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

echo ""
echo "Migrating for environment: $ENVIRONMENT"
echo ""

echo " -> Step 1/3: Compiling migration scripts."
echo ""
for filename in ./src/db/migrations/*.ts; do
 yarn tsc -t es6 -module CommonJS -outDir ./build-migrations $filename
done
yarn tsc -t es6 -module CommonJS -allowSyntheticDefaultImports -outDir ./src/config ./src/config/index.ts
yarn tsc ./src/db/config/index.ts
echo ""
echo " -> Compilation completed."
echo ""

echo ""
echo " -> Step 2/3: Starting migration."
echo ""
npx sequelize db:migrate --env=$ENVIRONMENT
echo ""
echo " -> Migration completed."
echo ""

echo ""
echo " -> Step 3/3: Deleting files."
echo ""
rm -rf ./src/db/config/index.js ./src/config/index.js
echo ""
echo " -> Deletion completed."