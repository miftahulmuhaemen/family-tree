
import { calculateRelationship, RelationshipType, Edge } from './src/utils/kinship';

function check(start: string, target: string, expect: string, edges: Edge[], people: any[]) {
    const res = calculateRelationship(start, target, edges, people);
    console.log(`${start} -> ${target}: ${res} (Expected: ${expect})`);
}

console.log("--- Comprehensive Analysis ---");

const edges = [
    // Gen 1 -> Gen 2
    { source: '1_gp', target: '2_budi' },
    { source: '1_gp', target: '2_agus' }, 

    // Gen 2 -> Gen 3
    { source: '2_budi', target: '3_eko' },
    { source: '2_sri', target: '3_eko' }, // Sri is Eko's mom
    { source: '2_agus', target: '3_rina' },

    // Gen 3 -> Gen 4
    { source: '3_eko', target: '4_alya' },
    { source: '3_dewi', target: '4_alya' }, // Dewi is Eko's wife via Alya
    
    { source: '3_rina', target: '4_rini' },
    { source: '3_dika', target: '4_rini' }, // Dika is Rina's husband

    // Dika's Family
    { source: '2_herman', target: '3_dika' },
    { source: '2_herman', target: '3_sari' }, 
    { source: '1_sastro', target: '2_herman' },
];

const people = [
    { id: '1_gp', gender: 'male' }, // Raden
    { id: '1_grandma', gender: 'female' }, // Siti
    { id: '4_alya', gender: 'female' },
    { id: '3_eko', gender: 'male' },
    { id: '3_rina', gender: 'female' },
    { id: '2_herman', gender: 'male' },
    { id: '3_sari', gender: 'female' },
    { id: '1_sastro', gender: 'male' },
    { id: '2_sri', gender: 'female' },
    { id: '3_dika', gender: 'male' },
    { id: '2_budi', gender: 'male' },
    { id: '2_agus', gender: 'male' },
    { id: '3_dewi', gender: 'female' },
    { id: '4_rini', gender: 'female' },
];

// Add Grandma (Siti) -> Gen 2
edges.push({ source: '1_grandma', target: '2_budi' });
edges.push({ source: '1_grandma', target: '2_agus' });


// 1. Dewi Lestari (3_dewi) Perspective
console.log("\n[Dewi's Perspective]");
check('3_dewi', '2_agus', 'Paman', edges, people); // Husband's Uncle
check('3_dewi', '3_rina', 'Sepupu Ipar', edges, people); // Husband's Cousin
check('3_dewi', '3_sari', 'Kerabat', edges, people); // Huband's Cousin's Sister-in-law? (Sepupu Ipar Jauh?)
check('3_dewi', '3_dika', 'Sepupu Ipar', edges, people); // Husband's Cousin's Husband
check('3_dewi', '4_rini', 'Keponakan', edges, people); // Husband's Cousin's Child (Keponakan Jauh?)

// 2. Raden (1_gp) Perspective
console.log("\n[Raden's Perspective]");
check('1_gp', '3_dewi', 'Cucu Menantu', edges, people); // Grandson's Wife
check('1_gp', '3_dika', 'Cucu Menantu', edges, people); // Granddaughter's Husband
check('1_gp', '2_herman', 'Besan', edges, people); // Parent of Cucu Menantu
check('1_gp', '3_sari', 'Besan', edges, people); // Sibling of Cucu Menantu

// 3. Siti (1_grandma) Perspective
console.log("\n[Siti's Perspective]");
check('1_grandma', '3_sari', 'Besan', edges, people);
