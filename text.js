const express = require('express');
const router =express.Router();
const Form = require('../models/Form');


// API Route to fetch data
router.get('/details', async (req, res) => {
    try {

        const avgOverall = await Form.aggregate([
            {
              $match: {
                overall: { $gte: 1, $lte: 5 } ,// Ensure the values are between 1 and 5
                quality: { $gte: 1, $lte: 5 }, // Ensure the values are between 1 and 5
                timeline: { $gte: 1, $lte: 5 }, // Ensure the values are between 1 and 5
                money: { $gte: 1, $lte: 5 }, // Ensure the values are between 1 and 5
                support: { $gte: 1, $lte: 5 } // Ensure the values are between 1 and 5
              }
            },
            {
              $group: {
                _id: null, // No grouping key; calculate for all documents
                avgOverall: { $avg: "$overall" }, // Calculate the average
                avgQuality: { $avg: "$quality" }, // Calculate the average
                avgTime: { $avg: "$timeline" } ,// Calculate the average
                avgMoney: { $avg: "$money" }, // Calculate the average
                avgSupport: { $avg: "$support" } // Calculate the average
              }
            }
          ]);

        // const items = await Form.find();
        // const items = await Form.findone('overall');
        const items = await Form.find({}, { overall: 1, _id: 0,quality:1,timeline:1,support:1, money: 1});
        // const count= this.length.items;
        
        res.json({
            count: items.length, // Number of documents
            data: items,
            avg:avgOverall,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

module.exports= router;


// -----------------------------------------------------------------
// const [overall, setoverall] = useState(0);
//   const [Overallavg, setavgOverall] = useState(0);
//   const [overall5, setoverall1] = useState(0);
//   const [overall4, setoverall2] = useState(0);
//   const [overall3, setoverall3] = useState(0);
//   const [overall2, setoverall4] = useState(0);
//   const [overall1, setoverall5] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/dashboard/details"
//         );
//         const total = response.data.count;
//         // console.log(response.data)
//         const avgOverall = response.data.averages.avgOverall;
//         const res5 = response.data.overDistribution.overall5.percentage;
//         const res4 = response.data.overDistribution.overall4.percentage;
//         const res3 = response.data.overDistribution.overall3.percentage;
//         const res2 = response.data.overDistribution.overall2.percentage;
//         const res1 = response.data.overDistribution.overall1.percentage;
//         setoverall(total);
//         setavgOverall(avgOverall);
//         setoverall1(res1);
//         setoverall2(res2);
//         setoverall3(res3);
//         setoverall4(res4);
//         setoverall5(res5);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);