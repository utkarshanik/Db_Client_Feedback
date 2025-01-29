const express = require('express');
const router =express.Router();
const Form = require('../models/Form');


// API Route to fetch data
router.get('/details', async (req, res) => {
  try {
    const feedbacks = await Form.find();
    const stats = await Form.aggregate([
        {
            $match: {
                overall: { $gte: 1, $lte: 5 },
                quality: { $gte: 1, $lte: 5 },
                timeline: { $gte: 1, $lte: 5 },
                money: { $gte: 1, $lte: 5 },
                support: { $gte: 1, $lte: 5 }
            }
        },
        {
            $facet: {
                // Average calculations for all fields
                averages: [
                    {
                        $group: {
                            _id: null,
                            avgOverall: { $avg: "$overall" },
                            avgQuality: { $avg: "$quality" },
                            avgTimeline: { $avg: "$timeline" },
                            avgMoney: { $avg: "$money" },
                            avgSupport: { $avg: "$support" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            avgOverall: { $multiply: ["$avgOverall", 10] },
                            avgQuality: { $multiply: ["$avgQuality", 10] },
                            avgTimeline: { $multiply: ["$avgTimeline", 10] },
                            avgMoney: { $multiply: ["$avgMoney", 10] },
                            avgSupport: { $multiply: ["$avgSupport", 10] }
                        }
                    }
                ],
                // Distributions for each field
                overallDistribution: [
                    { $group: { _id: "$overall", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                qualityDistribution: [
                    { $group: { _id: "$quality", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                timelineDistribution: [
                    { $group: { _id: "$timeline", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                moneyDistribution: [
                    { $group: { _id: "$money", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                supportDistribution: [
                    { $group: { _id: "$support", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                totalReviews: [
                    { $count: "count" }
                ]
            }
        }
    ]);
    
    // Extract results
    const averagesRaw = stats[0].averages[0] || {};
    const averages = {
    avgOverall: Math.round(averagesRaw.avgOverall || 0),
    avgQuality: Math.round(averagesRaw.avgQuality || 0),
    avgTimeline: Math.round(averagesRaw.avgTimeline || 0),
    avgMoney: Math.round(averagesRaw.avgMoney || 0),
    avgSupport: Math.round(averagesRaw.avgSupport || 0),
};
    const fields = ["overall", "quality", "timeline", "money", "support"]; // List of fields to handle
    const distributions = {};
    
    const totalReviews = stats[0].totalReviews[0]?.count || 0;

    // Populate distributions dynamically
    
    fields.forEach(field => {
        const distribution = stats[0][`${field}Distribution`] || [];
        distributions[`${field}Distribution`] = {
            // totalReviews,
            [`${field}5`]: { percentage: "0" },
            [`${field}4`]: { percentage: "0" },
            [`${field}3`]: { percentage: "0" },
            [`${field}2`]: { percentage: "0" },
            [`${field}1`]: { percentage: "0" }
        };
    
        // Populate counts and percentages for each score
        distribution.forEach(item => {
            if (item._id >= 1 && item._id <= 5) {
                const percentage = ((item.count / totalReviews) * 100).toFixed(0);
                distributions[`${field}Distribution`][`${field}${item._id}`] = {
                    percentage
                };
            }
        });
    });
    
    res.json({
        count:totalReviews,
        averages,
        overDistribution: distributions.overallDistribution|| {},
        overQuality: distributions.qualityDistribution|| {},
        overTimeline: distributions.timelineDistribution|| {},
        overMoney: distributions.moneyDistribution|| {},
        overSupport: distributions.supportDistribution|| {} ,
        feedbacks,
    });
    
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
}
});

module.exports= router;
