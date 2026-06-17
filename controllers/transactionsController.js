import db from "../config/db.js";
import { asyncHandel } from "../middleware/asyncMiddleware.js";

// export const TransactionsCreate = asyncHandel(async (req, res) => {

//     try {

//         const {
//             shareholder_id,
//             share_quantity,
//             percentage = 0,
//             share_price
//         } = req.body;

//         if (
//             !shareholder_id ||
//             !share_quantity ||
//             !share_price
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Required fields are missing"
//             });
//         }

//         const [user] = await db.query(
//             "SELECT id FROM shareholders WHERE id = ?",
//             [shareholder_id]
//         );

//         if (user.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Shareholder not found"
//             });
//         }
//         const amount =
//             share_price * share_quantity;

//         const investment =
//             amount * (percentage / 100);

//         const total_amount =
//             amount + investment;

//         const [existing] = await db.query(
//             "SELECT * FROM share_transactions WHERE shareholder_id = ?",
//             [shareholder_id]
//         );

//         if (existing.length > 0) {

//             const old = existing[0];

//             const newQuantity = old.share_quantity + share_quantity;

//             const newAmount = share_price * newQuantity

//             const newInvestment = newAmount * (percentage /100)

//             const newTotal = newAmount + newInvestment

//             await db.query(`
//                 UPDATE share_transactions
//                 SET
//                     share_quantity = ?,
//                     percentage = ?,
//                     share_price = ?,
//                     total_amount = ?
//                 WHERE shareholder_id = ?
//             `, [
//                 newQuantity,
//                 percentage,
//                 share_price,
//                 newTotal,
//                 shareholder_id
//             ]);

//             return res.status(200).json({
//                 success: true,
//                 message: "Transaction updated successfully"
//             });

//         }
//         await db.query(`
//             INSERT INTO share_transactions
//             (
//                 shareholder_id,
//                 share_quantity,
//                 percentage,
//                 share_price,
//                 total_amount
//             )
//             VALUES (?, ?, ?, ?, ?)
//         `, [
//             shareholder_id,
//             share_quantity,
//             percentage,
//             share_price,
//             total_amount
//         ]);

//         return res.status(201).json({
//             success: true,
//             message: "Transaction created successfully"
//         });

//     } catch (err) {

//         console.log(err);

//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// });

export const TransactionsList = asyncHandel(async (req, res) => {
  try {
    const [data] = await db.query(`
            SELECT
                st.id,
                st.shareholder_id,
                s.username,
                st.share_quantity,
                st.percentage,
                st.share_price,
                st.total_amount,
                st.status,
                DATE_FORMAT(
                st.purchase_date,
                '%d-%m-%Y'
                ) AS purchase_date,
                 
                DATE_FORMAT(
                st.created_at,
                '%d-%m-%Y %h:%i %p'
                ) AS created_at
                 
            FROM share_transactions st
            LEFT JOIN shareholders s
            ON st.shareholder_id = s.id
            ORDER BY st.created_at DESC
        `);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


export const userTransactionsList = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;

    const [data] = await db.query(
      `
      SELECT
        id,
        shareholder_id,
        share_quantity,
        percentage,
        share_price,
        total_amount,
        status,

        DATE_FORMAT(
          purchase_date,
          '%d-%m-%Y'
        ) AS purchase_date,

        DATE_FORMAT(
          created_at,
          '%d-%m-%Y %h:%i %p'
        ) AS created_at

      FROM share_transactions
      WHERE shareholder_id = ?
      ORDER BY created_at DESC
      `,
      [shareholder_id]
    );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



export const createLastAmount = asyncHandel(async (req, res) => {
  try {
    const { shareholder_id, last_amount } = req.body;

    if (!shareholder_id || !last_amount) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const [user] = await db.query("SELECT id FROM shareholders WHERE id = ?", [
      shareholder_id,
    ]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shareholder not found",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM last_amounts WHERE shareholder_id = ?",
      [shareholder_id]
    );

    console.log("shareholder_id:", shareholder_id, "last_amount:", last_amount);

    if (existing.length > 0) {

      await db.query(
        "UPDATE last_amounts SET last_amount = ? WHERE shareholder_id = ?",
        [last_amount, shareholder_id]
      );
      console.log("UPDATE (set to absolute value)");
    } else {
      console.log("INSERT");
      await db.query(
        "INSERT INTO last_amounts (shareholder_id, last_amount) VALUES (?,?)",
        [shareholder_id, last_amount]
      );
    }

    return res.status(201).json({
      success: true,
      message: "Last amount created/updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const lastAmountList = asyncHandel(async (req, res) => {
  try {
    const [data] = await db.query(`
            SELECT
                la.id,
                la.shareholder_id,
                s.username,
                la.last_amount,
                DATE_FORMAT(
                    la.created_at,
                    '%d-%m-%Y %h:%i %p'
                ) AS created_at
            FROM last_amounts la
            LEFT JOIN shareholders s
            ON la.shareholder_id = s.id
            ORDER BY la.created_at DESC
        `);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const userLastAmount = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;

    const [data] = await db.query(
      `
            SELECT
                id,
                shareholder_id,
                last_amount,
                DATE_FORMAT(
                    created_at,
                    '%d-%m-%Y %h:%i %p'
                ) AS created_at

            FROM last_amounts
            WHERE shareholder_id = ?
            ORDER BY created_at DESC
        `,
      [shareholder_id],
    );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const userLastAmountUpdate = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;
    const { id } = req.params;
    const { last_amount } = req.body;

    const [data] = await db.query(
      `SELECT * FROM last_amounts
       WHERE id = ? AND shareholder_id = ?`,
      [id, shareholder_id]
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Last Amount not found",
      });
    }

    await db.query(
      `UPDATE last_amounts
       SET last_amount = ?
       WHERE id = ? AND shareholder_id = ?`,
      [last_amount, id, shareholder_id]
    );

    return res.status(200).json({
      success: true,
      message: "Last Amount updated successfully",
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const BuyStatus = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;

    const [data] = await db.query(
      `
      SELECT
        id,
        shareholder_id,
        share_quantity,
        percentage,
        share_price,
        total_amount,
        DATE_FORMAT(
          purchase_date,
          '%d-%m-%Y'
        ) AS purchase_date,
        DATE_FORMAT(
          created_at,
          '%d-%m-%Y %h:%i %p'
        ) AS created_at
      FROM share_transactions
      WHERE shareholder_id = ?
        AND status = 'buy'
      ORDER BY created_at DESC
      `,
      [shareholder_id]
    );

    return res.status(200).json({
      message: "Buy Success",
      success: true,
      data,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const DividendStatus = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;

    const [data] = await db.query(
      `
      SELECT
        id,
        shareholder_id,
        share_quantity,
        percentage,
        share_price,
        total_amount,
        DATE_FORMAT(
          purchase_date,
          '%d-%m-%Y'
        ) AS purchase_date,
        DATE_FORMAT(
          created_at,
          '%d-%m-%Y %h:%i %p'
        ) AS created_at
      FROM share_transactions
      WHERE shareholder_id = ?
        AND status = 'dividend'
      ORDER BY created_at DESC
      `,
      [shareholder_id]
    );

    return res.status(200).json({
      message: "Buy Success",
      success: true,
      data,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const BuyListByUser = asyncHandel(async (req, res) => {
  try {
    const { id } = req.params;

    const [data] = await db.query(
      `
      SELECT
          st.id,
          st.shareholder_id,
          s.username,
          st.share_quantity,
          st.percentage,
          st.share_price,
          st.total_amount,
          st.status,
          DATE_FORMAT(
            st.purchase_date,
            '%d-%m-%Y'
          ) AS purchase_date,
          DATE_FORMAT(
            st.created_at,
            '%d-%m-%Y %h:%i %p'
          ) AS created_at
      FROM share_transactions st
      LEFT JOIN shareholders s
      ON st.shareholder_id = s.id
      WHERE st.status = 'buy'
      AND st.shareholder_id = ?
      ORDER BY st.created_at DESC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const DividendListByUser = asyncHandel(async (req, res) => {
  try {
    const { id } = req.params;

    const [data] = await db.query(
      `
      SELECT
          st.id,
          st.shareholder_id,
          s.username,
          st.share_quantity,
          st.percentage,
          st.share_price,
          st.total_amount,
          st.status,
          DATE_FORMAT(
            st.purchase_date,
            '%d-%m-%Y'
          ) AS purchase_date,
          DATE_FORMAT(
            st.created_at,
            '%d-%m-%Y %h:%i %p'
          ) AS created_at
      FROM share_transactions st
      LEFT JOIN shareholders s
      ON st.shareholder_id = s.id
      WHERE st.status = 'dividend'
      AND st.shareholder_id = ?
      ORDER BY st.created_at DESC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const TransactionTotal = asyncHandel(async (req, res) => {
  try {
    const shareholder_id = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN status = 'buy'
              THEN total_amount
              ELSE 0
            END
          ), 0
        ) AS total_buy_amount,

        COALESCE(
          SUM(profit_amount), 0
        ) AS total_profit_amount

      FROM share_transactions
      WHERE shareholder_id = ?
      `,
      [shareholder_id]
    );

    return res.status(200).json({
      success: true,
      message: "All Total Success",
      data: rows[0],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// export const TransactionsCreate = asyncHandel(async (req, res) => {
//   try {
//     const {
//       shareholder_id,
//       share_quantity,
//       percentage = 0,
//       share_price,
//       purchase_date,
//       status,
//     } = req.body;

//     if (
//       !shareholder_id ||
//       !share_quantity ||
//       !share_price ||
//       !purchase_date ||
//       !status
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     const [user] = await db.query(
//       "SELECT id FROM shareholders WHERE id = ?",
//       [shareholder_id]
//     );

//     if (user.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const amount = Number(share_price) * Number(share_quantity);

//     let total_amount = 0;
//     let profit_amount = 0;

//     // current last amount
//     const [lastRows] = await db.query(
//       "SELECT * FROM last_amounts WHERE shareholder_id = ?",
//       [shareholder_id]
//     );

//     const currentLastAmount =
//       lastRows.length > 0
//         ? Number(lastRows[0].last_amount)
//         : 0;

//     if (status === "buy") {
//       total_amount = amount;

//       const newLastAmount = currentLastAmount + total_amount;

//       if (lastRows.length > 0) {
//         await db.query(
//           "UPDATE last_amounts SET last_amount = ? WHERE shareholder_id = ?",
//           [newLastAmount, shareholder_id]
//         );
//       } else {
//         await db.query(
//           "INSERT INTO last_amounts (shareholder_id, last_amount) VALUES (?, ?)",
//           [shareholder_id, newLastAmount]
//         );
//       }
//     } else if (status === "dividend") {
//       profit_amount =
//         currentLastAmount * (Number(percentage) / 100);

//       total_amount = currentLastAmount;

//       const newLastAmount =
//         currentLastAmount + profit_amount;

//       if (lastRows.length > 0) {
//         await db.query(
//           "UPDATE last_amounts SET last_amount = ? WHERE shareholder_id = ?",
//           [newLastAmount, shareholder_id]
//         );
//       } else {
//         await db.query(
//           "INSERT INTO last_amounts (shareholder_id, last_amount) VALUES (?, ?)",
//           [shareholder_id, profit_amount]
//         );
//       }
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Use 'buy' or 'dividend'",
//       });
//     }

//     const [data] = await db.query(
//       `
//       INSERT INTO share_transactions
//       (
//         shareholder_id,
//         share_quantity,
//         percentage,
//         share_price,
//         total_amount,
//         profit_amount,
//         purchase_date,
//         status
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         shareholder_id,
//         share_quantity,
//         percentage,
//         share_price,
//         total_amount,
//         profit_amount,
//         purchase_date,
//         status,
//       ]
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Transaction created successfully",
//       insertId: data.insertId,
//     });
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });



export const TransactionsCreate = asyncHandel(async (req, res) => {
  try {
    const {
      shareholder_id,
      share_quantity,
      percentage = 0,
      share_price,
      purchase_date,
      status,
    } = req.body;

    // ၁။ လိုအပ်တဲ့ field များ ပါမပါ စစ်ဆေးခြင်း
    if (
      !shareholder_id ||
      !share_quantity ||
      !share_price ||
      !purchase_date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // ၂။ Shareholder အသုံးပြုသူ ရှိမရှိ စစ်ဆေးခြင်း
    const [user] = await db.query(
      "SELECT id FROM shareholders WHERE id = ?",
      [shareholder_id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // တန်ဖိုးများကို Number ပြောင်းလဲခြင်း
    const qtyInput = Number(share_quantity);
    const priceInput = Number(share_price);
    const percentInput = Number(percentage);
    const amount = priceInput * qtyInput;

    let total_amount = 0;
    let profit_amount = 0;

    // ၃။ လက်ရှိ current last amount ကို Database မှ ဆွဲယူခြင်း
    const [lastRows] = await db.query(
      "SELECT * FROM last_amounts WHERE shareholder_id = ?",
      [shareholder_id]
    );

    const currentLastAmount =
      lastRows.length > 0 ? Number(lastRows[0].last_amount) : 0;

    let newLastAmount = currentLastAmount;

    // ၄။ 🔥 Status အလိုက် စာရင်းများ တိကျစွာ တွက်ချက်ခြင်း
    if (status === "buy") {
      total_amount = amount;
      newLastAmount = currentLastAmount + total_amount; // ဝယ်ယူလျှင် လက်ကျန်ငွေ တိုးမည်
    } else if (status === "sell") {
      total_amount = amount;
      newLastAmount = currentLastAmount - total_amount; // ရောင်းချလျှင် လက်ကျန်ငွေ လျော့မည်
    } else if (status === "dividend") {
      // အမြတ်ငွေ = လက်ရှိလက်ကျန်ငွေ * ရာခိုင်နှုန်း
      profit_amount = currentLastAmount * (percentInput / 100);
      
      // စုစုပေါင်းပမာဏ = လက်ရှိလက်ကျန်ငွေ + ရရှိလာသော အမြတ်ငွေ
      total_amount = currentLastAmount + profit_amount; 
      newLastAmount = total_amount; 
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use 'buy', 'sell' or 'dividend'",
      });
    }

    // ၅။ last_amounts table ထဲသို့ Update သို့မဟုတ် Insert လုပ်ခြင်း
    if (lastRows.length > 0) {
      await db.query(
        "UPDATE last_amounts SET last_amount = ? WHERE shareholder_id = ?",
        [newLastAmount, shareholder_id]
      );
    } else {
      await db.query(
        "INSERT INTO last_amounts (shareholder_id, last_amount) VALUES (?, ?)",
        [shareholder_id, newLastAmount]
      );
    }

    // ၆။ 🔥 React/Mobile UI တွင် sync ဖြစ်စေရန် shares table ပါ လိုက်ပြင်ပေးခြင်း
    const [sharesRows] = await db.query(
      "SELECT * FROM shares WHERE shareholder_id = ?",
      [shareholder_id]
    );

    if (sharesRows.length > 0) {
      const currentQty = Number(sharesRows[0].share_quantity);
      const currentInv = Number(sharesRows[0].total_investment);
      
      let newQty = currentQty;
      let newInv = currentInv;

      if (status === "buy") {
        newQty = currentQty + qtyInput;
        newInv = currentInv + amount;
      } else if (status === "sell") {
        newQty = currentQty - qtyInput;
        newInv = currentInv - amount;
      } else if (status === "dividend") {
        // Dividend ထည့်လျှင်လည်း shares table ထဲက total_investment ကိုပါ တိုးချင်ပါက ပေါင်းပေးနိုင်သည်
        newInv = currentInv + profit_amount;
      }

      await db.query(
        `UPDATE shares SET share_quantity = ?, total_investment = ? WHERE shareholder_id = ?`,
        [newQty, newInv, shareholder_id]
      );
    }

    // ၇။ share_transactions စားပွဲထဲသို့ မှတ်တမ်းအဖြစ် ထည့်သွင်းခြင်း
    const [data] = await db.query(
      `
      INSERT INTO share_transactions
      (
        shareholder_id,
        share_quantity,
        percentage,
        share_price,
        total_amount,
        profit_amount,
        purchase_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        shareholder_id,
        qtyInput,
        percentInput,
        priceInput,
        total_amount, // အမြတ်အသစ်/အရင်းအနှီးအသစ် ပေါင်းစပ်ပြီးသား ပါသွားမည်
        profit_amount,
        purchase_date,
        status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Transaction created and database synchronized successfully",
      insertId: data.insertId,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});