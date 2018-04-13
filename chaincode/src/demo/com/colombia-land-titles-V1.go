package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// ColombiaLandTitlesCahinCode implements a simple chaincode to manage an asset
type ColombiaLandTitlesCahinCode struct {
}

// Predio JSON Object
type predio struct {
	ObjectType            string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	IDPredio              int    `json:"iDPredio"`
	Chip                  string `json:"chip"` //the fieldtags are needed to keep case from bouncing around
	MatriculaInmobiliaria string `json:"matriculaInmobiliaria"`
	CedulaCatastral       string `json:"cedulaCatastral"`
	DireccionPredio       string `json:"direccionPredio"`
	Terreno               int    `json:"terreno"`
	Construccion          int    `json:"construccion"`
	Tarifa                int    `json:"tarifa"`
	Ajuste                int    `json:"ajuste"`
	Extension             int    `json:"extension"`
	Propietario           String    `json:"propietario"`
}

// Persona JSON Object
type persona struct {
	ObjectType            string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	IDPersona             int    `json:"iDPersona"`
	Nombre                string `json:"iDPersona"`
	DireccionNotificacion string `json:"iDPersona"`
	CodigoMunicipio       string `json:"iDPersona"`
	CelularContacto       string `json:"iDPersona"`
	CorreoContacto        string `json:"iDPersona"`
	TelefonoContacto      string `json:"iDPersona"`
	IDPredio              int    `json:"iDPredio"`
}

// PromesaCompraVenta JSON Object
type promesaCompraVenta struct {
	ObjectType           string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	IDPromesaCompraVenta int    `json:"iDPersona"`
	ValorAcordado        string `json:"valorAcordado"` //the fieldtags are needed to keep case from bouncing around
	FechaCompraVenta     string `json:"fechaCompraVenta"`
	Estado               string `json:"estado"`
	IDPredio             int    `json:"iDPredio"`
	IDPersona            int    `json:"iDPersona"`
}

// ===================================================================================
// Main
// ===================================================================================
// main function starts up the chaincode in the container during instantiate
func main() {
	if err := shim.Start(new(ColombiaLandTitlesCahinCode)); err != nil {
		fmt.Printf("Error starting ColombiaLandTitlesCahinCode chaincode: %s", err)
	}
}

// Init is called during chaincode instantiation to initialize any data.
/*Note that chaincode upgrade also calls this function. When writing a chaincode that will upgrade an existing
one, make sure to modify the Init function appropriately. In particular, provide an empty “Init” method if there’s
no “migration” or nothing to be initialized as part of the upgrade.*/

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data, so be careful to avoid a scenario where you
// inadvertently clobber your ledger's data!
func (t *ColombiaLandTitlesCahinCode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("Building ledger initial state")

	//Validar si el ledger ya fue inicializado, para no reinicializarlo de nuevo
	predioAsBytes, err := stub.GetState("1")
	if predioAsBytes != nil {
		fmt.Println("ledger state previously set")
		return shim.Success(nil)
	}

	//Inicializar el ledger con los datos de Predios
	message, err := t.initLedgerPredios(stub)
	if err != nil {
		return shim.Error(err.Error())
	} else if message != "" {
		return shim.Error("Failed to run initLedgerPredios:" + message)
	}

	fmt.Println("ledger initial state set")
	return shim.Success(nil)

	/*
		// Get the args from the transaction proposal
		args := stub.GetStringArgs()
		if len(args) != 2 {
			return shim.Error("Incorrect arguments. Expecting a key and a value")
		}
		// Set up any variables or assets here by calling stub.PutState()
		// We store the key and the value on the ledger
		err := stub.PutState(args[0], []byte(args[1]))
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to create asset: %s", args[0]))
		}
		return shim.Success(nil)
	*/
}

// Invoke is called per transaction on the chaincode. Each transaction is
// either a 'get' or a 'set' on the asset created by Init function. The Set
// method may create a new asset by specifying a new key-value pair.
func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// Extract the function and args from the transaction proposal
	fn, args := stub.GetFunctionAndParameters()
	var result string
	var err error
	if fn == "set" {
		result, err = set(stub, args)
	} else {
		result, err = get(stub, args)
	}
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the result as success payload
	return shim.Success([]byte(result))
}

// Set stores the asset (both key and value) on the ledger. If the key exists,
// it will override the value with the new one
func set(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}
	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return "", fmt.Errorf("Failed to set asset: %s", args[0])
	}
	return args[1], nil
}

// Get returns the value of the specified asset key
func get(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key")
	}
	value, err := stub.GetState(args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if value == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}
	return string(value), nil
}

// ============================================================
// initLedgerPredios - sets the initial state of the ledger
// ============================================================
func (t *ColombiaLandTitlesCahinCode) initLedgerPredios(stub shim.ChaincodeStubInterface) (string, error) {
	// ==== Input sanitation ====
	fmt.Println("- start init initLedgerPredios")
	var err error

	// TODO INICIALIZAR CON DATOS DE ORACLE DATABASE
	predios := []predio{
		predio{IDPredio: 1, Chip: "AAA00156ZK", MatriculaInmobiliaria: "123456", CedulaCatastral: "13077A018000390000FP", DireccionPredio: "CR 1 # 2 - 34", Terreno: 800, Construccion: 300, Tarifa: 5, Ajuste: 100, Extension: 0, Propietario: "PEPITO PEREZ PEREIRA"}
		predio{IDPredio: 2, Chip: "ABC0016IK", MatriculaInmobiliaria: "050C1335240", CedulaCatastral: "13077A018000390000FP", DireccionPredio: "DG 86C # 57G 90", Terreno: 800, Construccion: 300, Tarifa: 5, Ajuste: 100, Extension: 0, Propietario: "JAIMITO GUTIERREZ"}
		predio{IDPredio: 3, Chip: "EFH0045UIJ", MatriculaInmobiliaria: "08A6U3456", CedulaCatastral: "A12BH678P", DireccionPredio: "CL 50 # 45 56", Terreno: 300, Construccion: 250, Tarifa: 15, Ajuste: 100, Extension: 50, Propietario: "ANA DELFA DE LAS CASAS"}
		predio{IDPredio: 4, Chip: "OPU9967YHA", MatriculaInmobiliaria: "67H5T6587", CedulaCatastral: "45HN7880PN", DireccionPredio: "AV 5 # 78 90", Terreno: 400, Construccion: 400, Tarifa: 1, Ajuste: 200, Extension: 45, Propietario: "CORPORACION LAS VILLOSAS"}
		predio{IDPredio: 5, Chip: "HHJ1UI319L", MatriculaInmobiliaria: "56GB88NC71IO", CedulaCatastral: "76HB7Y765GTYU", DireccionPredio: "DG 44 # 13 98", Terreno: 250, Construccion: 200, Tarifa: 4, Ajuste: 50, Extension: 0, Propietario: "INDUSTRIAS HERTZ"}
		predio{IDPredio: 6, Chip: "OOO8790CB6", MatriculaInmobiliaria: "67HYT8NH81", CedulaCatastral: "55H12YH678P98", DireccionPredio: "CL 124 # 67 68", Terreno: 570, Construccion: 500, Tarifa: 10, Ajuste: 100, Extension: 0, Propietario: "MARIA LA DEL BARRIO"}
		predio{IDPredio: 7, Chip: "BCA123YU9", MatriculaInmobiliaria: "06H0T890UI", CedulaCatastral: "45577CBHU789", DireccionPredio: "CL 58 SUR # 34 33", Terreno: 1000, Construccion: 800, Tarifa: 50, Ajuste: 500, Extension: 200, Propietario: "JOHN SHEPPARD"}
		predio{IDPredio: 8, Chip: "45GT12CH18", MatriculaInmobiliaria: "560OP133L", CedulaCatastral: "E11L1T3PW41331", DireccionPredio: "AV DORADO # 58 32", Terreno: 450, Construccion: 350, Tarifa: 4, Ajuste: 100, Extension: 0, Propietario: "PEPITO PEREZ PEREIRA"}
		predio{IDPredio: 9, Chip: "BBB1267IO", MatriculaInmobiliaria: "6797HDDC1", CedulaCatastral: "F22K23P578S", DireccionPredio: "CL 123B # 45A 28P INTERIOR 4 MANZANA 2 APT 305", Terreno: 500, Construccion: 500, Tarifa: 150, Ajuste: 200, Extension: 3810, Propietario: "EDMUNDO MAONDO"}
		predio{IDPredio: 10, Chip: "CB12AYU87A2", MatriculaInmobiliaria: "7891ABC23DF", CedulaCatastral: "45GH7U8N9C99FGT", DireccionPredio: "CL 2 # 45 67", Terreno: 1400, Construccion: 200, Tarifa: 1, Ajuste: 200, Extension: 300, Propietario: "JOSE DILMA GONONEL"}		
	}

	// add to ledger
	indexName := "iDPredio~matriculaInmobiliaria"	
	propietarioIndex := "propietario~identifier"

	i := 0
	for i < len(predios) {
		predioAsBytes, _ := json.Marshal(predios[i])
		stub.PutState(predios[i].iDPredio, predioAsBytes)
		// create indexes
		err = t.createIndex(stub, indexName, []string{predios[i].IDPredio, predios[i].MatriculaInmobiliaria})
		if err != nil {
			return "Failed to create Index", err
		}
		err = t.createIndex(stub, propietarioIndex, []string{predios[i].Propietario, predios[i].MatriculaInmobiliaria})
		if err != nil {
			return "Failed to create Index", err
		}

		fmt.Println("Added", predios[i])
		i = i + 1
	}	

	fmt.Println("- end init initLedgerPredios")
	return "", nil
}
