package com.authem.auth.service;

import com.authem.auth.dto.request.PlaceAskRequest;
import com.authem.auth.dto.request.PlaceBidRequest;
import com.authem.auth.dto.response.BidResponse;
import com.authem.auth.dto.response.TradeExecutionResponse;
import com.authem.auth.model.Bid;
import com.authem.listing.dto.AskDTOs.UserAskResponseDTO;
import com.authem.listing.entity.Ask;

import java.util.List;

public interface OrderMatchingService {
    TradeExecutionResponse placeBid(Long buyerId, PlaceBidRequest request);
    TradeExecutionResponse placeAsk(Long sellerId, PlaceAskRequest request);
    TradeExecutionResponse executeTrade(Bid bid, Ask ask);

    List<BidResponse> getUserBids(Long userId);
    List<UserAskResponseDTO> getUserAsks(Long userId);

    void cancelBid(Long userId, Long bidId);
    void cancelAsk(Long userId, Long askId);
}
