import BlockModel from '../models/block';

export default async (query:any) => {
  try{
    let { id_or_num = "" } = query;
    let result: Object;

    let query_gen = BlockModel
      .find({},
      {
        "block_id": 1,
        "block_num": 1,
        "createdAt": 1,
        "block.transactions.trx.id": 1
      });

    // check if id is passed
    // check if its a number or not else it gives parsing error
    (id_or_num !== undefined) ? isNaN(Number(id_or_num)) ? 
        query_gen.where({block_id: id_or_num}): query_gen.where({block_num: id_or_num}) : "";

    query_gen.limit(100);
    query_gen.sort({createdDate: -1});
    result = await query_gen.exec();
    
    return result;
  }catch(err){
    console.log(err);
  }
}
