use fuels::{prelude::*, tx::ContractId};

// Load abi from json
abigen!(MyContract, "out/debug/contract-abi.json");

async fn get_contract_instance() -> (MyContract,MyContract, ContractId) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(2),             /* Two wallets */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;
    let wallet = wallets.pop().unwrap();
    let wallet2 = wallets.pop().unwrap();

    let id = Contract::deploy(
        "./out/debug/contract.bin",
        &wallet,
        TxParameters::default(),
        StorageConfiguration::with_storage_path(Some(
            "./out/debug/contract-storage_slots.json".to_string(),
        )),
    )
    .await
    .unwrap();

    let contract = MyContract::new(id.clone(), wallet);
    let contract2 = MyContract::new(id.clone(), wallet2);

    (contract,contract2, id.into())
}

#[tokio::test]
async fn can_increase_game_counter() {
    let (contract,contract2, _id): (_,_,_) = get_contract_instance().await;

   
    let result = contract.methods().start_game().call().await.unwrap();
  
    let log = result.get_logs_with_type::<(u64, Identity)>().unwrap();
    println!("{:?}",log);
    assert_eq!(log[0].0,1);

    let result = contract2.methods().start_game().call().await.unwrap();
  
    let log = result.get_logs_with_type::<(u64, Identity)>().unwrap();
    println!("{:?}",log);
    assert_eq!(log[0].0,2); 
}

#[tokio::test]
async fn can_make_play() {
    let (contract,contract2, _id): (_,_,_) = get_contract_instance().await;

    let result = contract.methods().start_game().call().await.unwrap();
    
    let log = result.get_logs_with_type::<(u64, Identity)>().unwrap();
    println!("{:?}",log);
    assert_eq!(log[0].0,1);

    let result = contract2.methods().join_game(log[0].0).call().await.unwrap();
    
    let log = result.get_logs_with_type::<(u64, Identity)>().unwrap();
    
    assert_eq!(log[0].0,1); 

    let result = contract.methods().make_play(3,4).call().await.unwrap();

    let log = result.get_logs_with_type::<(u64,u8,u8,u8)>().unwrap();
    println!("{:?}",log);
    assert_eq!(log[0],(1,3,4,1));

}
