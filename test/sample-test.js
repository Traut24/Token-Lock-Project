const { expect } = require("chai");
const { ethers } = require("hardhat");
let owner;
let addr1;
let addr2;
// let addrs;
let token;
let token2;
let lock;
beforeEach(async function () {
  let Token = await ethers.getContractFactory("Token");
  token = await Token.deploy(10000);

  let Token2 = await ethers.getContractFactory("Token");
  token2 = await Token2.deploy(20000);

  let Lock = await ethers.getContractFactory("Lock");
  lock = await Lock.deploy();

  [owner, addr1, addr2] = await ethers.getSigners();
  await token.transfer(addr1.address, 1000);
  await token.transfer(addr1.address, 2000);
});
describe("Testing", function () {
  it("Token Approve testing (TransferFrom)", async function () {
    await token.approve(addr1.address, 5000);
    await token.connect(addr1).transferFrom(owner.address, lock.address, 1000);
    expect(await token.balanceOf(lock.address)).to.equal(1000);
  });
  it("Lock Token With Approve in contract", async function () {
    await token.approve(lock.address, 1000);
    await lock.lockToken(token.address, 500, 10);
    await lock.lockToken(token.address, 300, 15);
    expect(await token.balanceOf(lock.address)).to.equal(800);
  });
  it("Withdraw Token Testing", async function () {
    await token.approve(lock.address, 1000);
    await lock.lockToken(token.address, 500, 5);
    expect(await token.balanceOf(lock.address)).to.equal(500);
    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
    sleep(5000);
    await lock.withDrawToken(0);
    expect(await token.balanceOf(lock.address)).to.equal(0);
  });
});
