export const CONTRACT_ADDRESS = "0xBB671f3F5848d7D31B74052D3a621c3107E03622";

export const CONTRACT_ABI = [
  "function issueDiploma(string calldata _studentName, string calldata _program, string calldata _institution) external returns (bytes32)",
  "function revokeDiploma(bytes32 _diplomaId) external",

  "function verifyDiploma(bytes32 _diplomaId) external view returns (bool exists, bool valid, string memory studentName, string memory program, string memory institution, uint256 issuedAt, address issuedBy)",
  "function totalDiplomas() external view returns (uint256)",

  "event DiplomaIssued(bytes32 indexed diplomaId, string studentName, string program, string institution, address issuedBy, uint256 issuedAt)",
  "event DiplomaRevoked(bytes32 indexed diplomaId, address revokedBy)",
] as const;
