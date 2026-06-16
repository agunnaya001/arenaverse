/**
 * Smart Contract Templates for AI-Assisted Generation
 */

export const ERC20_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * {{TOKEN_NAME}} - ERC20 Token
 * {{DESCRIPTION}}
 */
contract {{TOKEN_SYMBOL}} is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = {{MAX_SUPPLY}} * 10 ** 18;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        _mint(msg.sender, initialSupply * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}`;

export const ERC721_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * {{COLLECTION_NAME}} - ERC721 NFT Collection
 * {{DESCRIPTION}}
 */
contract {{SYMBOL}} is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    string private _baseTokenURI = "{{BASE_URI}}";
    uint256 public constant MAX_SUPPLY = {{MAX_SUPPLY}};
    uint256 public MINT_PRICE = {{MINT_PRICE}} wei;
    
    mapping(address => bool) public minted;

    constructor() ERC721("{{COLLECTION_NAME}}", "{{SYMBOL}}") {}

    function mint() public payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        require(!minted[msg.sender], "Already minted");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        minted[msg.sender] = true;
        
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}`;

export const ERC1155_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * {{COLLECTION_NAME}} - ERC1155 Multi-Token
 * {{DESCRIPTION}}
 */
contract {{SYMBOL}} is ERC1155, Ownable {
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public maxSupply;
    mapping(uint256 => string) public tokenNames;
    
    uint256 public nextTokenId = 0;

    constructor(string memory baseURI) ERC1155(baseURI) {}

    function createToken(
        string memory name,
        uint256 supply,
        bytes memory data
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        tokenNames[tokenId] = name;
        maxSupply[tokenId] = supply;
        totalSupply[tokenId] = 0;
        
        return tokenId;
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        require(totalSupply[id] + amount <= maxSupply[id], "Exceeds max supply");
        totalSupply[id] += amount;
        _mint(to, id, amount, data);
    }

    function burn(uint256 id, uint256 amount) public {
        _burn(msg.sender, id, amount);
        totalSupply[id] -= amount;
    }
}`;

export const DAO_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

/**
 * {{DAO_NAME}} - Governance DAO
 * {{DESCRIPTION}}
 */
contract {{DAO_NAME}} is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    constructor(IVotes _token)
        Governor("{{DAO_NAME}}")
        GovernorSettings(
            {{VOTING_DELAY}},
            {{VOTING_PERIOD}},
            {{PROPOSAL_THRESHOLD}}
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction({{QUORUM_PERCENTAGE}})
    {}

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function quorumNumerator(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorumNumerator(blockNumber);
    }
}`;

export const STAKING_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * {{STAKING_NAME}} - Token Staking Contract
 * {{DESCRIPTION}}
 */
contract {{STAKING_NAME}} is Ownable {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    uint256 public rewardRate = {{REWARD_RATE}}; // Percentage per period
    uint256 public rewardPeriod = {{REWARD_PERIOD}}; // Seconds
    
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakeTime;
    mapping(address => uint256) public claimedRewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        stakedAmount[msg.sender] += amount;
        stakeTime[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }

    function calculateReward(address user) public view returns (uint256) {
        if (stakedAmount[user] == 0) return 0;
        
        uint256 duration = block.timestamp - stakeTime[user];
        uint256 periods = duration / rewardPeriod;
        
        return (stakedAmount[user] * rewardRate * periods) / 100;
    }

    function claimReward() public {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards available");
        
        claimedRewards[msg.sender] += reward;
        stakeTime[msg.sender] = block.timestamp;
        
        require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }

    function unstake(uint256 amount) public {
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");
        
        claimReward();
        stakedAmount[msg.sender] -= amount;
        
        require(stakingToken.transfer(msg.sender, amount), "Unstake transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
}`;

export interface ContractTemplate {
  name: string;
  type: 'ERC20' | 'ERC721' | 'ERC1155' | 'DAO' | 'Staking';
  template: string;
  variables: Record<string, string>;
  description: string;
}

export const TEMPLATES: Record<string, ContractTemplate> = {
  erc20: {
    name: 'ERC20 Token',
    type: 'ERC20',
    template: ERC20_TEMPLATE,
    variables: {
      TOKEN_NAME: 'Token Name',
      TOKEN_SYMBOL: 'TOKEN',
      MAX_SUPPLY: '1000000',
      DESCRIPTION: 'Your token description',
    },
    description: 'Standard fungible token contract',
  },
  erc721: {
    name: 'ERC721 NFT',
    type: 'ERC721',
    template: ERC721_TEMPLATE,
    variables: {
      COLLECTION_NAME: 'Collection Name',
      SYMBOL: 'NFTC',
      BASE_URI: 'https://your-api.com/metadata/',
      MAX_SUPPLY: '10000',
      MINT_PRICE: '1000000000000000000', // 1 ETH
      DESCRIPTION: 'Your NFT collection description',
    },
    description: 'Non-fungible token (NFT) collection',
  },
  erc1155: {
    name: 'ERC1155 Multi-Token',
    type: 'ERC1155',
    template: ERC1155_TEMPLATE,
    variables: {
      COLLECTION_NAME: 'Multi-Token Collection',
      SYMBOL: 'MULTI',
      DESCRIPTION: 'Your multi-token collection description',
    },
    description: 'Multi-token standard supporting both fungible and non-fungible tokens',
  },
  dao: {
    name: 'Governance DAO',
    type: 'DAO',
    template: DAO_TEMPLATE,
    variables: {
      DAO_NAME: 'MyDAO',
      VOTING_DELAY: '1', // 1 block
      VOTING_PERIOD: '45818', // ~1 week on Ethereum
      PROPOSAL_THRESHOLD: '1000000000000000000', // 1 token
      QUORUM_PERCENTAGE: '4',
      DESCRIPTION: 'Your DAO description',
    },
    description: 'Decentralized autonomous organization with governance token',
  },
  staking: {
    name: 'Staking Contract',
    type: 'Staking',
    template: STAKING_TEMPLATE,
    variables: {
      STAKING_NAME: 'TokenStaking',
      REWARD_RATE: '10', // 10% per period
      REWARD_PERIOD: '2592000', // 30 days
      DESCRIPTION: 'Your staking contract description',
    },
    description: 'Token staking contract with reward distribution',
  },
};

/**
 * Generate contract code with replaced variables
 */
export function generateContractCode(
  templateKey: string,
  variables: Record<string, string>
): string | null {
  const template = TEMPLATES[templateKey];
  if (!template) return null;

  let code = template.template;

  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    code = code.replace(regex, value);
  }

  return code;
}

/**
 * Validate contract variables
 */
export function validateContractVariables(
  templateKey: string,
  variables: Record<string, string>
): { valid: boolean; errors: string[] } {
  const template = TEMPLATES[templateKey];
  if (!template) {
    return { valid: false, errors: ['Invalid template key'] };
  }

  const errors: string[] = [];

  // Check required variables
  for (const [key] of Object.entries(template.variables)) {
    if (!variables[key]) {
      errors.push(`Missing required variable: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
