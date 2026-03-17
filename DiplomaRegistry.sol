// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomaRegistry {

    struct Diploma {
        string studentName;
        string program;
        string institution;
        uint256 issuedAt;
        bool    revoked;
        address issuedBy;
    }


    address public owner;

    mapping(bytes32 => Diploma) private diplomas;

    bytes32[] public diplomaIds;

    mapping(address => bool) public authorizedIssuers;

    event DiplomaIssued(
        bytes32 indexed diplomaId,
        string  studentName,
        string  program,
        string  institution,
        address issuedBy,
        uint256 issuedAt
    );

    event DiplomaRevoked(bytes32 indexed diplomaId, address revokedBy);
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner puede hacer esto");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner,
            "No estas autorizado para emitir diplomas"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }

    function authorizeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }

    function revokeIssuer(address _issuer) external onlyOwner {
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }

    function issueDiploma(
        string calldata _studentName,
        string calldata _program,
        string calldata _institution
    ) external onlyAuthorized returns (bytes32 diplomaId) {

        diplomaId = keccak256(
            abi.encodePacked(
                _studentName,
                _program,
                _institution,
                block.timestamp,
                msg.sender
            )
        );

        require(diplomas[diplomaId].issuedAt == 0, "Diploma ya existe");

        diplomas[diplomaId] = Diploma({
            studentName:  _studentName,
            program:      _program,
            institution:  _institution,
            issuedAt:     block.timestamp,
            revoked:      false,
            issuedBy:     msg.sender
        });

        diplomaIds.push(diplomaId);

        emit DiplomaIssued(
            diplomaId,
            _studentName,
            _program,
            _institution,
            msg.sender,
            block.timestamp
        );

        return diplomaId;
    }

    function revokeDiploma(bytes32 _diplomaId) external onlyAuthorized {
        require(diplomas[_diplomaId].issuedAt != 0, "Diploma no existe");
        require(!diplomas[_diplomaId].revoked, "Ya fue revocado");
        diplomas[_diplomaId].revoked = true;
        emit DiplomaRevoked(_diplomaId, msg.sender);
    }

    function verifyDiploma(bytes32 _diplomaId)
        external
        view
        returns (
            bool    exists,
            bool    valid,
            string memory studentName,
            string memory program,
            string memory institution,
            uint256 issuedAt,
            address issuedBy
        )
    {
        Diploma memory d = diplomas[_diplomaId];
        exists = d.issuedAt != 0;
        valid  = exists && !d.revoked;
        return (exists, valid, d.studentName, d.program, d.institution, d.issuedAt, d.issuedBy);
    }
    
    function totalDiplomas() external view returns (uint256) {
        return diplomaIds.length;
    }
}
