import PendingMatches from "./PendingMatches";
import Users from "./Users";

const minThres = 0.6;

function objectToTrueArray(obj) {
    return Object.keys(obj).filter(k => obj[k]);
}

function driverCompare(otherUser, currUser) {
    const interestScore = compareInterests(
        objectToTrueArray(currUser.questionnaire.interests),
        objectToTrueArray(otherUser.questionnaire.interests)
    );
    const lifestyleScore = compareLifestyle(
        objectToTrueArray(currUser.questionnaire.lifestyle),
        objectToTrueArray(otherUser.questionnaire.lifestyle)
    );
    const otherScore = compareOther(currUser, otherUser);

    return combineScores(interestScore, lifestyleScore, otherScore);
}

function compareInterests(A, B) {
    return tanimotoDistance(commonElementCount(A, B), A.length, B.length);
}

function compareLifestyle(A, B) {
    return tanimotoDistance(commonElementCount(A, B), A.length, B.length);
}

function commonElementCount(A, B) {
    return A.reduce((count, element) => count + B.includes(element), 0);
}

//Comparing Age and Gender Preferences
function compareOther(A, B) {
    let otherScore = true;
    let ageCuttoff;

    if (A.age > 50 || B.age > 50) ageCuttoff = 20;
    else ageCuttoff = 10;

    if (
        !ageMatches(
            A.questionnaire.agePreference,
            B.questionnaire.agePreference,
            A.age,
            B.age,
            ageCuttoff
        )
    )
        otherScore = false;

    if (
        !genderMatches(
            A.questionnaire.genderPreference,
            B.questionnaire.genderPreference,
            A.gender,
            B.gender
        )
    )
        otherScore = false;

    return otherScore;
}

function ageMatches(AprefAge, BprefAge, AgeA, AgeB, ageCuttoff) {
    return (
        AprefAge + ageCuttoff >= AgeB &&
        AprefAge - ageCuttoff <= AgeB &&
        BprefAge + ageCuttoff >= AgeA &&
        BprefAge - ageCuttoff <= AgeA
    );
}

function genderMatches(AprefGender, Bprefgender, Agender, Bgender) {
    return Agender === Bprefgender && Bgender === AprefGender;
}

// Tanimoto Distance formula
function tanimotoDistance(C, A, B) {
    if (A.length <= 0 || B.length <= 0 || C <= 0) return 0;
    return C / (A + B - C);
}

function combineScores(interestScore, lifestyleScore, otherScore) {
    const totalScore = interestScore + lifestyleScore / 2;

    return totalScore > minThres && otherScore;
}

// to prevent previous matches from coming up multiple times
export function alreadyMatched(user, otherUser) {
    if (!user.matches && !otherUser.matches) return false;
    if (user.matches && user.matches[otherUser.id] !== null) return true;
    if (otherUser.matches && otherUser.matches[user.id] !== null) return true;

    return false;
}

// This function contains the matchmaking algorithm using the
// Tanimoto Distance forumla and our own specifications.
export default async function (currentUser) {
    const users = await Users.getAll();
    const otherActiveUsers = users.filter(
        u => u.id !== currentUser.id && u.active && !alreadyMatched(currentUser, u)
    );

    // remove people they already matched with!
    // sorry Bouchard :(

    for (let i = 0; i < otherActiveUsers.length; i++) {
        const user = otherActiveUsers[i];
        const userMatches = driverCompare(user, currentUser);

        if (await PendingMatches.get(user.id)) continue;

        if (userMatches) return user;
    }

    return null;
}
