########### colombia-land-titles-blockchain #############################

# Preparacion del repositorio de GIT

- Create a new repository on the command line

echo "# colombia-land-titles-blockchain" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/rafaelgomeztellez/colombia-land-titles-blockchain.git
git push -u origin master


- Push an existing repository from the command line

git remote add origin https://github.com/rafaelgomeztellez/colombia-land-titles-blockchain.git
git push -u origin master

- Actualizar Version local: usar comando
git pull origin master

## Preparacion de BD ##########################

- Ejecutar los scripts del directorio: sqlscripts en el siguiente orden:

1- createUser.sql
2- data.sql
3- tables.sql


## Preparacion de Chaincode

- Compilar el smart contract

cd \colombia-land-titles-blockchain\chaincode\src\demo\com
go get -u --tags nopkcs11 github.com/hyperledger/fabric/core/chaincode/shim
go build --tags nopkcs11
