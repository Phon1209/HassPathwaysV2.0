import clientPromise from ".";
import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient;
let db: Db;
let file: Collection;

async function init() {
    if (db) return;
    try {
        client = await clientPromise;
        db = await client.db(); 
        file = await db.collection('2020');
    } catch (error) {
        throw new Error('Failed to establish connection to database');
    }
}

(async () => {
    await init();
})();

type Cluster = {
    name: string;
    courses: string[]; 
};

type PathwayDetails = {
    name: string;
    description: string;
    clusters: Cluster[];
};

type Pathway = {
    _id: string;
    department: string;
    pathways: PathwayDetails[];
};

// const testDocument = {
//     department: "Test Department",
//     pathways: [
//         {
//             name: "Test Pathway",
//             description: "This is a test pathway",
//             clusters: [
//                 { name: "Test Cluster", courses: ["TEST-1001", "TEST-2002"] }
//             ],
//             compatibleMinor: ["Test Minor"]
//         }
//     ]
// };

export async function getPathways(): Promise<{ data?: Pathway[]; error?: string }> {
    try {
        if (!file) await init();

        const result = await file
            .find({})
            .limit(20)
            .map((each: any) => ({
                _id: each._id.toString(),
                department: each.department,
                pathways: each.pathways,
            }))
            .toArray();

        console.log(result);

        // const result2 = await file.insertOne(testDocument);
        // return { insertedId: result.insertedId.toString() };

        return { data: result };
    } catch (error) {
        return { error: "Failed to fetch pathways" };
    }
}


